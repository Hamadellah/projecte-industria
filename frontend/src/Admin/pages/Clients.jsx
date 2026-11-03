import { useEffect, useState } from "react";
import { Users, Trash2, UserRound, X, Mail, Phone, MapPin, CalendarDays, Eye } from "lucide-react";
import { deleteUser, getUser, getUsers, updateUserRole } from "../../services/userService";

function unwrapUser(result) {
  return result?.data?.user || result?.user || result?.data || result;
}

export default function Clients() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  async function load() {
    setLoading(true);
    try {
      const result = await getUsers(1);
      setUsers(result.data || []);
      setError("");
    } catch (err) {
      setError(err.message || "Erreur de chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function openDetails(user) {
    setSelectedUser(user);
    setDetailsLoading(true);
    setDetailsError("");
    try {
      const result = await getUser(user.id);
      setSelectedUser(unwrapUser(result));
    } catch (err) {
      setDetailsError(err.message || "Impossible de charger les détails du client.");
    } finally {
      setDetailsLoading(false);
    }
  }

  async function changeRole(id, role) {
    setSavingId(id);
    setError("");
    try {
      await updateUserRole(id, role);
      await load();
      if (selectedUser?.id === id) setSelectedUser((current) => ({ ...current, role }));
    } catch (err) {
      setError(err.message || "Impossible de modifier le rôle");
    } finally {
      setSavingId(null);
    }
  }

  async function remove(user) {
    if (!window.confirm(`Supprimer le compte de ${user.name} ?`)) return;
    setError("");
    try {
      await deleteUser(user.id);
      if (selectedUser?.id === user.id) setSelectedUser(null);
      await load();
    } catch (err) {
      setError(err.message || "Impossible de supprimer cet utilisateur");
    }
  }

  const detailRow = (label, value, Icon) => (
    <div className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
      <div className="mt-0.5 text-amber-600"><Icon size={17} /></div>
      <div className="min-w-0"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 break-words text-sm font-medium text-[#0A2540]">{value || "Non renseigné"}</p></div>
    </div>
  );

  return (
    <section className="min-h-screen space-y-6 bg-[#F4F6F8] p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0A2540] text-white"><Users size={23} /></div>
        <div><p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Comptes et accès</p><h1 className="mt-1 text-2xl font-bold text-[#0A2540]">Clients et utilisateurs</h1><p className="mt-1 text-sm text-slate-500">Consultez les comptes et gérez leurs rôles.</p></div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div><h2 className="font-semibold text-[#0A2540]">Liste des utilisateurs</h2><p className="mt-1 text-xs text-slate-500">{users.length} utilisateur(s) affiché(s)</p></div>
          <div className="rounded-lg bg-blue-50 p-2.5 text-blue-700"><UserRound size={19} /></div>
        </div>
        {loading ? <p className="p-6 text-sm text-slate-500">Chargement des utilisateurs...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Utilisateur</th><th className="px-5 py-4">Email</th><th className="px-5 py-4">Rôle</th><th className="px-5 py-4">Inscription</th><th className="px-5 py-4">Action</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => <tr key={user.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0A2540] text-sm font-semibold text-white">{(user.name || "U").charAt(0).toUpperCase()}</div><span className="font-semibold text-[#0A2540]">{user.name}</span></div></td>
                  <td className="px-5 py-4"><button type="button" onClick={() => openDetails(user)} className="font-medium text-blue-700 underline decoration-blue-200 underline-offset-4 hover:text-blue-900">{user.email}</button></td>
                  <td className="px-5 py-4"><select disabled={savingId === user.id} value={user.role} onChange={(e) => changeRole(user.id, e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-amber-500 disabled:opacity-50"><option value="customer">Client</option><option value="admin">Admin</option></select></td>
                  <td className="whitespace-nowrap px-5 py-4 text-slate-600">{user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "—"}</td>
                  <td className="px-5 py-4"><button type="button" onClick={() => remove(user)} aria-label={`Supprimer ${user.name}`} className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button></td>
                </tr>)}
                {!users.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">Aucun utilisateur trouvé.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A2540]/50 p-4" onClick={() => setSelectedUser(null)}>
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div><p className="text-xs font-semibold uppercase tracking-wider text-amber-700">Fiche utilisateur</p><h2 className="mt-1 text-xl font-bold text-[#0A2540]">Détails du client</h2></div>
              <button type="button" onClick={() => setSelectedUser(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
            </div>
            {detailsLoading ? <p className="p-8 text-center text-sm text-slate-500">Chargement des informations...</p> : (
              <div className="space-y-5 p-5">
                {detailsError && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{detailsError}</div>}
                <div className="flex items-center gap-4 rounded-xl bg-[#0A2540] p-5 text-white">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-xl font-bold">{(selectedUser.name || "U").charAt(0).toUpperCase()}</div>
                  <div><h3 className="text-lg font-bold">{selectedUser.name || "Utilisateur"}</h3><p className="mt-1 text-sm text-blue-100">{selectedUser.email || "Email non renseigné"}</p></div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {detailRow("Nom complet", selectedUser.name, UserRound)}
                  {detailRow("Adresse email", selectedUser.email, Mail)}
                  {detailRow("Téléphone", selectedUser.phone || selectedUser.phone_number, Phone)}
                  {detailRow("Adresse", selectedUser.address || selectedUser.full_address, MapPin)}
                  {detailRow("Ville", selectedUser.city, MapPin)}
                  {detailRow("Date d'inscription", selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleString("fr-FR") : null, CalendarDays)}
                  {detailRow("Rôle", selectedUser.role, Eye)}
                  {detailRow("Identifiant", selectedUser.id, UserRound)}
                </div>
                <div className="flex justify-end"><button type="button" onClick={() => setSelectedUser(null)} className="rounded-lg bg-[#0A2540] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#12395d]">Fermer</button></div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}