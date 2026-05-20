"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ScrollAnimation from "@/components/ScrollAnimation";
import Link from "next/link";

export default function NuevaContrasenaPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // Supabase handles the token from the URL automatically via onAuthStateChange
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });
    // Also check if already has session (e.g. page refresh after token processed)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionReady(true);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Por favor completa ambos campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard"), 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F9F8F6] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#EAE8E4] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#EAE8E4] blur-[120px] pointer-events-none" />

      <ScrollAnimation className="relative z-10 w-full max-w-md">
        <div className="bg-white p-10 shadow-xl border border-black/5 rounded-sm">

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#111] mb-3">¡Contraseña actualizada!</h2>
              <p className="text-[#666] text-sm mb-6">Tu contraseña ha sido cambiada exitosamente.</p>
              <p className="text-[#888] text-xs">Redirigiendo al dashboard en 3 segundos...</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="w-12 h-12 bg-[#F9F8F6] border border-black/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#8A6D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-serif font-bold text-[#111] mb-2">Nueva Contraseña</h1>
                <p className="text-[#666] text-sm">Elige una contraseña segura para tu cuenta.</p>
              </div>

              {!sessionReady && (
                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-sm">
                  <p className="text-amber-700 text-xs text-center">
                    Procesando enlace de recuperación... Si esto tarda, vuelve al email y haz clic de nuevo.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111] mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border-b border-black/20 pb-2 text-sm outline-none focus:border-[#8A6D3B] transition-colors bg-transparent pr-8"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 bottom-2 text-[#888] hover:text-[#111] transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showPassword
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                        }
                      </svg>
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2 flex gap-1 items-center">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length >= i * 3
                            ? password.length >= 10 ? "bg-green-500" : password.length >= 6 ? "bg-yellow-500" : "bg-red-400"
                            : "bg-black/10"
                        }`} />
                      ))}
                      <span className="text-[10px] text-[#888] ml-1">
                        {password.length < 6 ? "Muy corta" : password.length < 10 ? "Aceptable" : "Segura"}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111] mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`w-full border-b pb-2 text-sm outline-none transition-colors bg-transparent ${
                      confirmPassword && confirmPassword !== password
                        ? "border-red-400" : "border-black/20 focus:border-[#8A6D3B]"
                    }`}
                    required
                  />
                  {confirmPassword && confirmPassword !== password && (
                    <p className="text-red-500 text-[10px] mt-1">Las contraseñas no coinciden</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !sessionReady}
                  className="w-full bg-[#111] text-white py-4 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Guardar Nueva Contraseña
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-[#888]">
                <Link href="/login" className="text-[#8A6D3B] hover:text-[#6D552E] transition-colors">
                  ← Volver al inicio de sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </ScrollAnimation>
    </div>
  );
}
