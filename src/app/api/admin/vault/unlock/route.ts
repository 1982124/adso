import { NextResponse } from "next/server";
import { getSession, getUserRole } from "@/lib/auth";
import { hasMinRole } from "@/lib/rbac";
import { createVaultSession, isVaultConfigured, VAULT_COOKIE, VAULT_MAX_AGE, verifyVaultPassword } from "@/lib/vault";

export async function POST(request: Request) {
  const session = await getSession();
  const role = getUserRole(session);
  if (!session?.user || !hasMinRole(role, "admin")) {
    return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  }

  if (!isVaultConfigured()) {
    return NextResponse.json({ error: "Le coffre-fort n'est pas encore configuré. Ajoutez ADSO_VAULT_PASSWORD_HASH et ADSO_VAULT_SESSION_SECRET dans les variables d'environnement du serveur." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { password?: string } | null;
  if (!body?.password || body.password.length > 256) {
    return NextResponse.json({ error: "Mot de passe invalide." }, { status: 400 });
  }

  if (!verifyVaultPassword(body.password)) {
    return NextResponse.json({ error: "Mot de passe du coffre-fort incorrect." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(VAULT_COOKIE, createVaultSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: VAULT_MAX_AGE,
  });
  return response;
}
