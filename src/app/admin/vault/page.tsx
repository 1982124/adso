import { redirect } from "next/navigation";
import { getSession, getUserRole } from "@/lib/auth";
import { hasMinRole } from "@/lib/rbac";
import { verifyVaultSession, VAULT_COOKIE } from "@/lib/vault";
import { cookies } from "next/headers";
import VaultUnlock from "@/components/admin/VaultUnlock";

export default async function AdminVaultPage() {
  const session = await getSession();
  const role = getUserRole(session);
  if (!session?.user || !hasMinRole(role, "admin")) redirect("/");

  const cookieStore = await cookies();
  const unlocked = verifyVaultSession(cookieStore.get(VAULT_COOKIE)?.value);

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-[#050a0a] px-4 py-8 text-white sm:px-6 lg:px-10">
        <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
          <VaultUnlock />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050a0a] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-950/80 via-slate-950 to-cyan-950/30 p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">🔐 Coffre-fort personnel ADSO</p>
          <h1 className="mt-3 text-3xl font-black">Zone financière et stratégique</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">Cette zone est séparée de Françoise et des autres assistants. Les données sensibles restent accessibles uniquement à l'administrateur autorisé.</p>
        </div>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {["💰 Revenus par service", "💳 Paiements & transactions", "📈 Chiffre d'affaires", "🏦 Informations financières", "🔑 Secrets & intégrations", "🛡️ Journal de sécurité"].map((item) => (
            <article key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
              <h2 className="font-semibold">{item}</h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">Données réservées au propriétaire du coffre-fort.</p>
            </article>
          ))}
        </section>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-5 text-sm leading-6 text-amber-100/80">Protection active : Françoise ne reçoit pas les données de cette zone et aucune réponse de l'assistante ne doit permettre de contourner cette séparation.</div>
      </div>
    </main>
  );
}
