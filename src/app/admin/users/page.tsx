"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, ChevronDown } from "lucide-react";

type Profile = {
  id: string;
  full_name: string | null;
  instrument: string | null;
  level: string | null;
  role: string;
  created_at: string;
};

const ROLES = ["student", "teacher", "admin"];
const ROLE_LABELS: Record<string, string> = { student: "Alumno", teacher: "Profesor", admin: "Admin" };
const ROLE_COLORS: Record<string, string> = {
  student: "bg-blue-400/10 text-blue-400",
  teacher: "bg-[#8A6D3B]/20 text-[#C4A265]",
  admin: "bg-purple-400/10 text-purple-400",
};

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchUsers = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers((data as Profile[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchUsers(false);
    });
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdating(userId);
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    if (!error) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    }
    setUpdating(null);
  };

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.instrument?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-white mb-1">Gestión de Usuarios</h1>
        <p className="text-white/40 text-sm">Asigna roles a los miembros de la academia.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Buscar por nombre o instrumento..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#8A6D3B]/50 transition-colors rounded-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/5 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Usuario</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-white/30 hidden md:table-cell">Instrumento</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-white/30 hidden lg:table-cell">Nivel</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-white/30 hidden sm:table-cell">Miembro desde</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-white/30 text-sm">Cargando usuarios...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-white/30 text-sm">No se encontraron usuarios.</td></tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-sm bg-[#8A6D3B]/20 flex items-center justify-center text-[#C4A265] text-xs font-bold shrink-0">
                        {user.full_name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.full_name || "Sin nombre"}</p>
                        <p className="text-white/30 text-xs truncate max-w-[120px]">{user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white/50 text-sm hidden md:table-cell">
                    {user.instrument || <span className="text-white/20">—</span>}
                  </td>
                  <td className="p-4 hidden lg:table-cell">
                    <span className="text-xs text-white/50 capitalize">{user.level}</span>
                  </td>
                  <td className="p-4 text-white/40 text-xs hidden sm:table-cell">
                    {new Date(user.created_at).toLocaleDateString("es-ES")}
                  </td>
                  <td className="p-4">
                    <div className="relative">
                      <select
                        value={user.role}
                        disabled={updating === user.id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`appearance-none text-xs font-bold uppercase tracking-wider px-3 py-1.5 pr-7 rounded-sm outline-none cursor-pointer transition-all disabled:opacity-50 ${ROLE_COLORS[user.role]}`}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r} className="bg-[#1a1a1a] text-white normal-case">
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-white/20 text-xs mt-4">{filtered.length} usuario(s) encontrado(s)</p>
    </div>
  );
}
