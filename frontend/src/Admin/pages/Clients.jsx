
import { useEffect, useState } from "react";
import { deleteUser, getUsers, updateUserRole } from "../services/userService";

export default function Clients() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const result = await getUsers(1);
      setUsers(result.data || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function changeRole(id, role) {
    setSavingId(id);
    try {
      await updateUserRole(id, role);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingId(null);
    }
  }

  async function remove(user) {
    if (!window.confirm(`Supprimer le compte de ${user.name} ?`)) return;
    try {
      await deleteUser(user.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="p-6">Chargement des utilisateurs...</p>;

  return (
    <section className="space-y-5 p-6">
      <div><h1 className="text-2xl font-bold text-[#0A2540]">Clients et utilisateurs</h1><p className="mt-1 text-sm text-slate-500">Gestion des comptes enregistrés</p></div>
      {error && <p className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-4">Nom</th><th className="p-4">Email</th><th className="p-4">Rôle</th><th className="p-4">Inscription</th><th className="p-4">Actions</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select disabled={savingId === user.id} value={user.role} onChange={(e) => changeRole(user.id, e.target.value)} className="rounded-lg border p-2">
                    <option value="customer">Client</option><option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4">{user.created_at ? new Date(user.created_at).toLocaleDateString("fr-FR") : "—"}</td>
                <td className="p-4"><button onClick={() => remove(user)} className="font-medium text-red-600">Supprimer</button></td>
              </tr>
            ))}
            {!users.length && <tr><td colSpan="5" className="p-6 text-center text-slate-500">Aucun utilisateur trouvé.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}
