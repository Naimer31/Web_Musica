"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User, Mail, Lock, Save, LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export default function PerfilPage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setName(profile?.full_name || user.user_metadata?.full_name || "");
      setEmail(user.email || "");
      setLoading(false);
    };
    load();
  }, [router, supabase]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileMsg(null);
    setSavingProfile(true);
    try {
      const { error: authError } = await supabase.auth.updateUser({ data: { full_name: name } });
      const { error: dbError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: name,
        email: user.email,
        updated_at: new Date().toISOString(),
      });
      if (authError || dbError) {
        setProfileMsg({ type: "error", text: "Error al guardar el perfil. Intenta de nuevo." });
      } else {
        setProfileMsg({ type: "success", text: "¡Perfil actualizado correctamente!" });
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (!newPassword) { setPasswordMsg({ type: "error", text: "Ingresa una nueva contraseña." }); return; }
    if (newPassword.length < 6) { setPasswordMsg({ type: "error", text: "Mínimo 6 caracteres." }); return; }
    if (newPassword !== confirmPassword) { setPasswordMsg({ type: "error", text: "Las contraseñas no coinciden." }); return; }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordMsg({ type: "error", text: error.message });
      } else {
        setPasswordMsg({ type: "success", text: "¡Contraseña actualizada!" });
        setNewPassword("");
        setConfirmPassword("");
      }
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const avatarLetter = name?.charAt(0)?.toUpperCase() || "?";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="fixed top-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm mb-10">
          <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
        </Link>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center text-3xl font-bold border-2 border-white/10">
            {avatarLetter}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{name || "Tu Perfil"}</h1>
            <p className="text-white/50 text-sm">{email}</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="font-semibold text-white">Información Personal</h2>
          </div>

          {profileMsg && (
            <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              profileMsg.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {profileMsg.type === "success" ? "✓" : "✗"} {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">Nombre Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">Correo Electrónico</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-3">
                <Mail className="w-4 h-4 text-white/30" />
                <span className="text-sm text-white/50">{email}</span>
                <span className="ml-auto text-[10px] bg-white/10 text-white/40 px-2 py-0.5 rounded-full">No editable</span>
              </div>
            </div>
            <button type="submit" disabled={savingProfile}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50">
              {savingProfile ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {savingProfile ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-violet-400" />
            </div>
            <h2 className="font-semibold text-white">Cambiar Contraseña</h2>
          </div>

          {passwordMsg && (
            <div className={`mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
              passwordMsg.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {passwordMsg.type === "success" ? "✓" : "✗"} {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handleSavePassword} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">Nueva Contraseña</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••" minLength={6}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-violet-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-white/50 mb-2">Confirmar Contraseña</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite la contraseña"
                className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors ${
                  confirmPassword && confirmPassword !== newPassword ? "border-red-500/40" : "border-white/10 focus:border-violet-500/50"
                }`} />
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-red-400 text-xs mt-1">Las contraseñas no coinciden</p>
              )}
            </div>
            <button type="submit" disabled={savingPassword}
              className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50">
              {savingPassword ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
              {savingPassword ? "Guardando..." : "Cambiar Contraseña"}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-8">
          <h2 className="font-semibold text-red-400 mb-2">Zona de Peligro</h2>
          <p className="text-white/40 text-sm mb-5">Al cerrar sesión se eliminará tu sesión activa en este dispositivo.</p>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-xl border border-red-500/20 transition-colors">
            <LogOut className="w-4 h-4" /> Cerrar Sesión
          </button>
        </div>

      </div>
    </div>
  );
}
