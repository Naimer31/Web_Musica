"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ScrollAnimation from "@/components/ScrollAnimation";

export default function RecuperarPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError("Por favor ingresa tu email.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/nueva-contrasena`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSent(true);
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

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-serif font-bold text-[#111] mb-3">Email enviado</h2>
              <p className="text-[#666] text-sm mb-2">
                Hemos enviado un enlace para restablecer tu contraseña a:
              </p>
              <p className="text-[#111] font-bold text-sm mb-6">{email}</p>
              <p className="text-[#888] text-xs mb-8">
                Revisa tu bandeja de entrada y sigue las instrucciones del email.
              </p>
              <Link
                href="/login"
                className="inline-block w-full bg-[#111] text-white py-4 text-sm font-bold text-center hover:bg-[#333] transition-colors"
              >
                Volver a Iniciar Sesión
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-10 text-center">
                <div className="w-12 h-12 bg-[#F9F8F6] border border-black/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-[#8A6D3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h1 className="text-3xl font-serif font-bold text-[#111] mb-2">Recuperar Contraseña</h1>
                <p className="text-[#666] text-sm">
                  Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111] mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full border-b border-black/20 pb-2 text-sm outline-none focus:border-[#8A6D3B] transition-colors bg-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#111] text-white py-4 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Enviar enlace de recuperación
                </button>
              </form>

              <p className="mt-8 text-center text-[#666] text-xs">
                ¿Recordaste tu contraseña?{" "}
                <Link href="/login" className="text-[#111] font-bold hover:text-[#8A6D3B] transition-colors">
                  Iniciar Sesión
                </Link>
              </p>
            </>
          )}
        </div>
      </ScrollAnimation>
    </div>
  );
}
