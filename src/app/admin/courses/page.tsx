"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Course = {
  id: string;
  title: string;
  description: string | null;
  instrument: string | null;
  level: string;
  price: number | null;
  duration_weeks: number | null;
  max_students: number;
  is_active: boolean;
};

const LEVELS = ["beginner", "intermediate", "advanced", "all"];
const LEVEL_LABELS: Record<string, string> = { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado", all: "Todos los niveles" };

const BLANK: Omit<Course, "id"> = {
  title: "", description: "", instrument: "", level: "all",
  price: null, duration_weeks: null, max_students: 10, is_active: true,
};

export default function AdminCoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "create" | "edit">(null);
  const [form, setForm] = useState<Omit<Course, "id">>(BLANK);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchCourses = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const { data } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    setCourses(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    queueMicrotask(() => {
      fetchCourses(false);
    });
  }, [fetchCourses]);

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    if (modal === "create") {
      const { data } = await supabase.from("courses").insert([form]).select().single();
      if (data) setCourses((prev) => [data, ...prev]);
    } else if (editId) {
      await supabase.from("courses").update(form).eq("id", editId);
      setCourses((prev) => prev.map((c) => c.id === editId ? { id: editId, ...form } : c));
    }
    setSaving(false);
    setModal(null);
    setForm(BLANK);
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este curso?")) return;
    await supabase.from("courses").delete().eq("id", id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const openEdit = (course: Course) => {
    const { id, ...rest } = course;
    setForm(rest);
    setEditId(id);
    setModal("edit");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white mb-1">Gestión de Cursos</h1>
          <p className="text-white/40 text-sm">Crea, edita y administra el catálogo de cursos.</p>
        </div>
        <button
          onClick={() => { setForm(BLANK); setModal("create"); }}
          className="flex items-center gap-2 bg-[#8A6D3B] hover:bg-[#6D552E] text-white px-5 py-2.5 text-sm font-bold transition-colors rounded-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Curso
        </button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-sm p-8 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif font-bold text-white text-xl">{modal === "create" ? "Nuevo Curso" : "Editar Curso"}</h2>
              <button onClick={() => setModal(null)}><X className="w-5 h-5 text-white/40 hover:text-white" /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">Título *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#8A6D3B]/50 rounded-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">Descripción</label>
                <textarea rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#8A6D3B]/50 resize-none rounded-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">Instrumento</label>
                  <input value={form.instrument || ""} onChange={(e) => setForm({ ...form, instrument: e.target.value })}
                    placeholder="Piano, Violín..."
                    className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#8A6D3B]/50 rounded-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">Nivel</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#8A6D3B]/50 rounded-sm">
                    {LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">Precio ($)</label>
                  <input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) || null })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#8A6D3B]/50 rounded-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/40 mb-2">Máx. Alumnos</label>
                  <input type="number" value={form.max_students} onChange={(e) => setForm({ ...form, max_students: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-[#8A6D3B]/50 rounded-sm" />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setForm({ ...form, is_active: !form.is_active })}
                  className={`w-10 h-6 rounded-full transition-colors relative ${form.is_active ? "bg-[#8A6D3B]" : "bg-white/10"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${form.is_active ? "left-5" : "left-1"}`} />
                </div>
                <span className="text-sm text-white/60">Curso activo (visible al público)</span>
              </label>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setModal(null)} className="flex-1 py-3 border border-white/10 text-white/50 text-sm rounded-sm hover:bg-white/5 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving || !form.title}
                className="flex-1 py-3 bg-[#8A6D3B] text-white text-sm font-bold rounded-sm hover:bg-[#6D552E] transition-colors disabled:opacity-50">
                {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="text-center text-white/30 py-20">Cargando cursos...</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-white/30 py-20">No hay cursos creados aún.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white/[0.03] border border-white/5 rounded-sm p-6 hover:bg-white/[0.05] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm mb-3 inline-block ${
                    course.is_active ? "bg-green-400/10 text-green-400" : "bg-white/10 text-white/30"
                  }`}>
                    {course.is_active ? "Activo" : "Inactivo"}
                  </span>
                  <h3 className="text-white font-serif font-bold text-lg leading-tight">{course.title}</h3>
                </div>
              </div>
              <p className="text-white/40 text-xs mb-4 line-clamp-2">{course.description || "Sin descripción."}</p>
              <div className="flex flex-wrap gap-2 mb-6 text-[10px]">
                {course.instrument && <span className="bg-white/5 text-white/50 px-2 py-1 rounded-sm">{course.instrument}</span>}
                <span className="bg-white/5 text-white/50 px-2 py-1 rounded-sm">{LEVEL_LABELS[course.level]}</span>
                {course.price && <span className="bg-[#8A6D3B]/10 text-[#C4A265] px-2 py-1 rounded-sm">${course.price}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(course)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-bold transition-colors rounded-sm">
                  <Pencil className="w-3 h-3" /> Editar
                </button>
                <button onClick={() => handleDelete(course.id)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-400/10 hover:bg-red-400/20 text-red-400 text-xs font-bold transition-colors rounded-sm">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
