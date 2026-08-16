import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getSession, getUserRole } from "@/lib/auth";
import { hasMinRole } from "@/lib/rbac";
import { createVaultSession, isVaultConfigured, VAULT_COOKIE, VAULT_MAX_AGE, verifyVaultPassword } from "@/lib/vault";

const FAILURE_COOKIE = "adso_vault_failures";
const FAILURE_WINDOW_SECONDS = 15 * 60;
const MAX_FAILURES = 5;
const FAILURE_DELAY_MS = 750;

type FailureState = { startedAt: number; count: number };

function signFailureState(payload: string) {
  const secret = process.env.ADSO_VAULT_SESSION_SECRET;
  if (!secret) return "";
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function readFailureState(request: Request): FailureState {
  const raw = request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${FAILURE_COOKIE}=`))?.slice(FAILURE_COOKIE.length + 1);
  if (!raw) return { startedAt: Math.floor(Date.now() / 1000), count: 0 };

  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return { startedAt: Math.floor(Date.now() / 1000), count: 0 };
  const expected = signFailureState(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (!expected || a.length !== b.length || !timingSafeEqual(a, b)) {
    return { startedAt: Math.floor(Date.now() / 1000), count: 0 };
  }

  const [startedAtRaw, countRaw] = Buffer.from(payload, "base64url").toString("utf8").split(":");
  const startedAt = Number(startedAtRaw);
  const count = Number(countRaw);
  if (!Number.isFinite(startedAt) || !Number.isFinite(count) || Math.floor(Date.now() / 1000) - startedAt >= FAILURE_WINDOW_SECONDS) {
    return { startedAt: Math.floor(Date.now() / 1000), count: 0 };
  }
  return { startedAt, count: Math.max(0, Math.floor(count)) };
}

function attachFailureCookie(response: NextResponse, state: FailureState) {
  const payload = Buffer.from(`${state.startedAt}:${state.count}`, "utf8").toString("base64url");
  const signature = signFailureState(payload);
  response.cookies.set(FAILURE_COOKIE, `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: FAILURE_WINDOW_SECONDS,
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  const role = getUserRole(session);
  if (!session?.user || !hasMinRole(role, "admin")) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  }

  if (!isVaultConfigured()) {
    return NextResponse.json({ error: "Le coffre-fort n'est pas encore configuré. Ajoutez ADSO_VAULT_PASSWORD_HASH et ADSO_VAULT_SESSION_SECRET dans les variables d'environnement du serveur." }, { status: 503 });
  }

  const failures = readFailureState(request);
  if (failures.count >= MAX_FAILURES) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(FAILURE_WINDOW_SECONDS) } },
    );
  }

  const body = await request.json().catch(() => null) as { password?: string } | null;
  if (!body?.password || body.password.length > 256) {
    return NextResponse.json({ error: "Mot de passe invalide." }, { status: 400 });
  }

  if (!verifyVaultPassword(body.password)) {
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    const nextFailures = { startedAt: failures.startedAt, count: failures.count + 1 };
    const response = NextResponse.json({ error: "Mot de passe du coffre-fort incorrect." }, { status: 401 });
    attachFailureCookie(response, nextFailures);
    return response;
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(VAULT_COOKIE, createVaultSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: VAULT_MAX_AGE,
  });
  response.cookies.set(FAILURE_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: 0 });
  return response;
}
