"use client";

import { useState } from "react";
import ScrollAnimation from "@/components/ScrollAnimation";
import { useLanguage } from "@/context/LanguageContext";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "loading" | "success" | "error";

export default function Enroll() {
  const { t } = useLanguage();
  const supabase = createClient();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    instrument: "",
    experience: "",
    payMethod: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email) {
      setErrorMsg("Por favor completa tu nombre y correo.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const { error } = await supabase.from("admission_requests").insert([
      {
        full_name: form.full_name,
        email: form.email,
        instrument: form.instrument || null,
        experience: form.experience || null,
        payment_method: form.payMethod || null,
      },
    ]);

    if (error) {
      console.error("Error al enviar solicitud:", error.message);
      setErrorMsg("Hubo un error al enviar tu solicitud. Intenta de nuevo.");
      setStatus("error");
    } else {
      setStatus("success");
      setForm({ full_name: "", email: "", instrument: "", experience: "", payMethod: "" });
    }
  };

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-0">
      <div className="container mx-auto px-6 max-w-6xl mb-24">
        <ScrollAnimation className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#111] mb-6">{t("enroll.title")}</h1>
          <p className="text-[#666] max-w-2xl mx-auto text-lg leading-relaxed">
            {t("enroll.desc")}
          </p>
        </ScrollAnimation>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column */}
          <div className="lg:w-1/2">
            <ScrollAnimation delay={100} className="space-y-12">
              <div className="h-64 bg-[#EAE8E4] rounded-sm overflow-hidden flex items-center justify-center relative">
                <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop" alt="Abstract Architecture" className="w-full h-full object-cover grayscale opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#111]/30 to-transparent mix-blend-overlay" />
              </div>

              <div>
                <h3 className="text-2xl font-serif font-bold text-[#111] mb-6">{t("enroll.contactTitle")}</h3>
                <ul className="space-y-6 text-[#555]">
                  <li className="flex items-start gap-4">
                    <svg className="w-5 h-5 text-[#8A6D3B] mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>1200 Harmony Lane, Arts District, Vienna</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <svg className="w-5 h-5 text-[#8A6D3B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <span>+43 1 234 5678</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <svg className="w-5 h-5 text-[#8A6D3B] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <span>admissions@virtuoso-academy.com</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 border border-black/5 rounded-sm">
                <h3 className="text-xl font-serif font-bold text-[#111] mb-6">{t("enroll.hoursTitle")}</h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex justify-between items-center border-b border-black/5 pb-4">
                    <span className="font-bold text-[#111]">{t("enroll.hours.monFri")}</span>
                    <span className="text-[#666]">08:00 — 21:00</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-black/5 pb-4">
                    <span className="font-bold text-[#111]">{t("enroll.hours.sat")}</span>
                    <span className="text-[#666]">09:00 — 18:00</span>
                  </li>
                  <li className="flex justify-between items-center pb-2">
                    <span className="font-bold text-[#111]">{t("enroll.hours.sun")}</span>
                    <span className="text-[#666]">{t("enroll.hours.sunDesc")}</span>
                  </li>
                </ul>
              </div>
            </ScrollAnimation>
          </div>

          {/* Right Column - Form */}
          <div className="lg:w-1/2">
            <ScrollAnimation delay={200} className="bg-white p-10 md:p-12 rounded-sm border border-black/5 shadow-xl h-full">
              
              {/* Success State */}
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#F3ECE1] flex items-center justify-center mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8A6D3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-[#111] mb-4">
                    {t("language") === "es" ? "¡Solicitud Enviada!" : "Request Sent!"}
                  </h2>
                  <p className="text-[#666] text-sm leading-relaxed max-w-xs mb-8">
                    {t("language") === "es"
                      ? "Hemos recibido tu solicitud. Un oficial de admisiones se comunicará contigo pronto."
                      : "We have received your request. An admissions officer will contact you shortly."}
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="border border-black/20 text-sm font-medium px-6 py-3 hover:bg-black/5 transition-colors"
                  >
                    {t("language") === "es" ? "Enviar otra solicitud" : "Send another request"}
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-serif font-bold text-[#111] mb-2">{t("enroll.formTitle")}</h2>
                  <p className="text-[#666] text-sm mb-10 leading-relaxed">{t("enroll.formDesc")}</p>

                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111] mb-2">{t("enroll.labels.name")}</label>
                      <input
                        type="text"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        placeholder={t("enroll.labels.namePlace")}
                        className="w-full border-b border-black/20 pb-2 text-sm outline-none focus:border-[#8A6D3B] transition-colors bg-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111] mb-2">{t("enroll.labels.email")}</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder={t("enroll.labels.emailPlace")}
                        className="w-full border-b border-black/20 pb-2 text-sm outline-none focus:border-[#8A6D3B] transition-colors bg-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111] mb-2">{t("enroll.labels.inst")}</label>
                      <select
                        name="instrument"
                        value={form.instrument}
                        onChange={handleChange}
                        className="w-full border-b border-black/20 pb-2 text-sm outline-none focus:border-[#8A6D3B] transition-colors bg-transparent text-[#666] appearance-none"
                      >
                        <option value="">{t("enroll.labels.instDefault")}</option>
                        <option value="piano">{t("enroll.insts.piano")}</option>
                        <option value="strings">{t("enroll.insts.strings")}</option>
                        <option value="guitar">{t("enroll.insts.guitar")}</option>
                        <option value="vocals">{t("enroll.insts.vocals")}</option>
                        <option value="production">{t("enroll.insts.prod")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111] mb-2">{t("enroll.labels.exp")}</label>
                      <textarea
                        rows={4}
                        name="experience"
                        value={form.experience}
                        onChange={handleChange}
                        placeholder={t("enroll.labels.expPlace")}
                        className="w-full border-b border-black/20 pb-2 text-sm outline-none focus:border-[#8A6D3B] transition-colors bg-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#111] mb-2">{t("enroll.labels.payMethod")}</label>
                      <select
                        name="payMethod"
                        value={form.payMethod}
                        onChange={handleChange}
                        className="w-full border-b border-black/20 pb-2 text-sm outline-none focus:border-[#8A6D3B] transition-colors bg-transparent text-[#666] appearance-none"
                      >
                        <option value="">{t("enroll.labels.payMethodDefault")}</option>
                        <option value="card">{t("enroll.payMethods.card")}</option>
                        <option value="yape">{t("enroll.payMethods.yape")}</option>
                      </select>
                    </div>

                    {/* Error message */}
                    {status === "error" && (
                      <p className="text-red-500 text-xs text-center">{errorMsg}</p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-[#8A6D3B] text-white py-4 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#6D552E] transition-colors group mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <>
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                          {t("language") === "es" ? "Enviando..." : "Sending..."}
                        </>
                      ) : (
                        <>
                          {t("enroll.submit")}
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-center text-[#888] italic mt-6">
                      {t("enroll.terms")}
                    </p>
                  </form>
                </>
              )}
            </ScrollAnimation>
          </div>
        </div>
      </div>

      <div className="h-[400px] w-full mt-24">
        <ScrollAnimation animation="fade-in" className="w-full h-full">
          <img src="https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=2070&auto=format&fit=crop" alt="Piano" className="w-full h-full object-cover grayscale opacity-90" />
        </ScrollAnimation>
      </div>
    </div>
  );
}
