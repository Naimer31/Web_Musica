"use client";

import Link from "next/link";
import ScrollAnimation from "@/components/ScrollAnimation";
import { useLanguage } from "@/context/LanguageContext";

export default function Teachers() {
  const { t } = useLanguage();
  interface Teacher {
    name: string;
    role: string;
    desc: string;
  }
  const teachers = (t("teachers.list") as unknown as Teacher[]) || [];

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <ScrollAnimation className="text-center mb-20">
          <h4 className="text-[#8A6D3B] font-bold tracking-widest text-xs uppercase mb-6">{t("teachers.over")}</h4>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#111] mb-6">{t("teachers.title")}</h1>
          <p className="text-[#666] max-w-2xl mx-auto text-lg leading-relaxed">
            {t("teachers.desc")}
          </p>
        </ScrollAnimation>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {teachers.map((teacher, i) => {
            const images = [
              // Dr. Julian Vance - hombre serio, violinista
              "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
              // Elena Rodriguez - mujer elegante
              "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
              // Marcus Thorne - hombre maduro
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
              // Sarah Jennings - mujer joven
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&auto=format&fit=crop&q=80",
              // Dr. Robert Liao - hombre con gafas
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80",
              // Claire DuPont - mujer sonriente
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
            ];
            const imgSrc = images[i % images.length];
            return (
              <ScrollAnimation key={teacher.name} delay={i * 100} className="bg-white rounded-sm overflow-hidden border border-black/5 hover:shadow-xl transition-all duration-300 group">
                <div className="h-80 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img
                    src={imgSrc}
                    alt={teacher.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-serif font-bold text-[#111]">{teacher.name}</h3>
                    <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8A6D3B" strokeWidth="2"><path d="M9 18V5l12-2v13"/><path d="M6 15H3c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3v-3z"/><path d="M21 13h-3c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3v-3z"/></svg>
                    </div>
                  </div>
                  <h4 className="text-[#8A6D3B] font-bold tracking-widest text-[10px] uppercase mb-6">{teacher.role}</h4>
                  <div className="border-l-2 border-[#8A6D3B] pl-4 mb-8">
                    <p className="text-[#666] text-sm leading-relaxed h-16">
                      {teacher.desc}
                    </p>
                  </div>
                  <button className="w-full py-3 border border-black/10 text-sm font-medium text-[#111] hover:bg-black/5 transition-colors">
                    {t("teachers.viewBio")}
                  </button>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>

        <ScrollAnimation delay={200} className="relative rounded-sm overflow-hidden bg-black text-white">
          <div className="absolute inset-0 z-0">
            <img src="https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=2070&auto=format&fit=crop" alt="Piano keys" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </div>
          <div className="relative z-10 p-16 md:p-24 text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">{t("teachers.ctaTitle")}</h2>
            <p className="text-white/70 max-w-xl mx-auto mb-10 text-lg">
              {t("teachers.ctaDesc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/enroll" className="bg-[#8A6D3B] text-white px-8 py-4 text-sm font-bold hover:bg-[#6D552E] transition-colors w-full sm:w-auto text-center">
                {t("teachers.ctaBtn1")}
              </Link>
              <Link href="/contact" className="bg-transparent border border-white/30 text-white px-8 py-4 text-sm font-bold hover:bg-white/10 transition-colors w-full sm:w-auto text-center">
                {t("teachers.ctaBtn2")}
              </Link>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
}
