"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import ScrollAnimation from "@/components/ScrollAnimation";

export default function LoginPage() {
  const supabase = createClient();
  const { t } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email o contraseña incorrectos. Verifica tus datos.");
        } else if (error.message.includes("Email not confirmed")) {
          setError("Tu email no ha sido confirmado. Revisa tu bandeja de entrada.");
        } else {
          setError(error.message);
        }
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) setError(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError(null);
    setGithubLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      if (error) setError(error.message);
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F9F8F6] flex items-center justify-center py-20 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#EAE8E4] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#EAE8E4] blur-[120px] pointer-events-none" />

      <ScrollAnimation className="relative z-10 w-full max-w-md">
        <div className="bg-white p-10 shadow-xl border border-black/5 rounded-sm">

          <div className="flex flex-col items-center mb-10 text-center">
            <h1 className="text-3xl font-serif font-bold text-[#111] mb-2">{t("login.welcome")}</h1>
            <p className="text-[#666] text-sm">{t("login.desc")}</p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 text-xs">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Social Logins */}
            <div className="flex flex-col gap-3">
              {/* Google Sign-In Button */}
              <button
                onClick={handleGoogleLogin}
                type="button"
                disabled={googleLoading || githubLoading || loading}
                className="w-full flex items-center justify-center gap-3 h-12 border border-black/20 text-[#111] font-medium text-sm hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
              >
                {googleLoading ? (
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {t("login.google")}
              </button>

              {/* GitHub Sign-In Button */}
              <button
                onClick={handleGithubLogin}
                type="button"
                disabled={googleLoading || githubLoading || loading}
                className="w-full flex items-center justify-center gap-3 h-12 bg-[#24292e] text-white font-medium text-sm hover:bg-[#2f363d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
              >
                {githubLoading ? (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.193 22 16.44 22 12.017 22 6.484 17.522 2 12 2z"/>
                  </svg>
                )}
                {t("login.github")}
              </button>
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-black/10"></div>
              <span className="flex-shrink-0 mx-4 text-[#888] text-[10px] uppercase font-bold tracking-widest">{t("login.or")}</span>
              <div className="flex-grow border-t border-black/10"></div>
            </div>

            <form className="space-y-6" onSubmit={handleEmailLogin}>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111] mb-2" htmlFor="email">
                  {t("login.email")}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("login.emailPlace")}
                  className="w-full border-b border-black/20 pb-2 text-sm outline-none focus:border-[#8A6D3B] transition-colors bg-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111] mb-2" htmlFor="password">
                  {t("login.password")}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("login.passPlace")}
                    className="w-full border-b border-black/20 pb-2 text-sm outline-none focus:border-[#8A6D3B] transition-colors bg-transparent pr-8"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 bottom-2 text-[#888] hover:text-[#111] transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#666]">&nbsp;</span>
                <Link href="/recuperar" className="text-xs text-[#8A6D3B] hover:text-[#6D552E] transition-colors font-medium">
                  {t("login.forgot")}
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-[#111] text-white py-4 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#333] transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {t("login.submit")}
              </button>
            </form>
          </div>

          <p className="mt-8 text-center text-[#666] text-xs">
            {t("login.noAccount")}{" "}
            <Link href="/registro" className="text-[#111] font-bold hover:text-[#8A6D3B] transition-colors">
              {t("login.register")}
            </Link>
          </p>
        </div>
      </ScrollAnimation>
    </div>
  );
}
