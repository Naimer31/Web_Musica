"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, X, Clock } from "lucide-react";

type Request = {
  id: string;
  full_name: string;
  email: string;
  instrument: string | null;
  experience: string | null;
  payment_method: string | null;
  status: "pending" | "approved" | "rejected";
  notes: string | null;
  created_at: string;
};

const STATUS_STYLES = {
  pending:  "bg-amber-400/10 text-amber-400",
  approved: "bg-green-400/10 text-green-400",
  rejected: "bg-red-400/10 text-red-400",
};
const STATUS_LABELS = { pending: "Pendiente", approved: "Aprobado", rejected: "Rechazado" };

export default function AdminRequestsPage() {
  const supabase = createClient();
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selected, setSelected] = useState<Request | null>(null);
  const [notes, setNotes] = useState("");

  const fetchRequests = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    let query = supabase.from("admission_requests").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;
    setRequests(data || []);
    setLoading(false);
  }, [filter, supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchRequests(false);
    });
  }, [fetchRequests]);

  const handleFilterChange = (f: typeof filter) => {
    setFilter(f);
    setLoading(true);
  };

  const handleStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdating(id);
    await supabase.from("admission_requests").update({ status, notes }).eq("id", id);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status, notes } : r));
    setSelected(null);
    setNotes("");
    setUpdating(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-white mb-1">Solicitudes de Admisión</h1>
        <p className="text-white/40 text-sm">Aprueba o rechaza las solicitudes del formulario de inscripción.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${
              filter === f ? "bg-[#8A6D3B] text-white" : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
            }`}
          >
            {f === "all" ? "Todas" : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-serif font-bold text-white mb-6">Detalle de Solicitud</h2>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between"><span className="text-white/40">Nombre</span><span className="text-white font-medium">{selected.full_name}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Email</span><span className="text-white">{selected.email}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Instrumento</span><span className="text-white">{selected.instrument || "—"}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Método de Pago</span><span className="text-white uppercase text-xs mt-0.5">{selected.payment_method === 'yape' ? 'Yape' : selected.payment_method === 'card' ? 'Tarjeta' : "—"}</span></div>
              <div className="flex justify-between"><span className="text-white/40">Estado</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${STATUS_STYLES[selected.status]}`}>{STATUS_LABELS[selected.status]}</span>
              </div>
            </div>
            {selected.experience && (
              <div className="mb-6">
                <p className="text-white/40 text-xs mb-2 uppercase tracking-wider font-bold">Experiencia</p>
                <p className="text-white/70 text-sm leading-relaxed bg-white/5 p-3 rounded-sm">{selected.experience}</p>
              </div>
            )}
            <div className="mb-6">
              <label className="text-white/40 text-xs mb-2 uppercase tracking-wider font-bold block">Nota interna (opcional)</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Añade una nota sobre esta decisión..."
                className="w-full bg-white/5 border border-white/10 p-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#8A6D3B]/50 resize-none rounded-sm"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleStatus(selected.id, "approved")}
                disabled={!!updating}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-bold rounded-sm disabled:opacity-50"
              >
                <Check className="w-4 h-4" /> Aprobar
              </button>
              <button
                onClick={() => handleStatus(selected.id, "rejected")}
                disabled={!!updating}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-bold rounded-sm disabled:opacity-50"
              >
                <X className="w-4 h-4" /> Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/5 rounded-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Solicitante</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-white/30 hidden md:table-cell">Instrumento</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-white/30 hidden sm:table-cell">Fecha</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Estado</th>
              <th className="text-left p-4 text-[10px] font-bold uppercase tracking-wider text-white/30">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-white/30 text-sm">Cargando...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-white/30 text-sm">No hay solicitudes.</td></tr>
            ) : requests.map((req) => (
              <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-[#8A6D3B]/20 rounded-sm flex items-center justify-center text-[#C4A265] text-xs font-bold">
                      {req.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{req.full_name}</p>
                      <p className="text-white/30 text-xs">{req.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-white/50 text-sm hidden md:table-cell">{req.instrument || "—"}</td>
                <td className="p-4 text-white/40 text-xs hidden sm:table-cell">
                  {new Date(req.created_at).toLocaleDateString("es-ES")}
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm ${STATUS_STYLES[req.status]}`}>
                    {STATUS_LABELS[req.status]}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => { setSelected(req); setNotes(req.notes || ""); }}
                    className="text-[#C4A265] text-xs font-bold hover:text-[#8A6D3B] transition-colors flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3" /> Revisar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
