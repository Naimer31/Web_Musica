"use client";

import Link from "next/link";
import { useState } from "react";
import ScrollAnimation from "@/components/ScrollAnimation";
import { useLanguage } from "@/context/LanguageContext";

export default function Courses() {
  const { t } = useLanguage();
  interface Course {
    title: string;
    level: string;
    desc: string;
    price: string;
  }
  const allCourses = (t("courses.list") as unknown as Course[]) || [];

  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedDiff, setSelectedDiff] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Map category labels to instruments/keywords
  const catKeywords: Record<string, string[]> = {
    "strings": ["cello", "violin", "cuerda", "string", "cello"],
    "keyboards": ["piano", "keyboard", "teclado", "clásico", "classical"],
    "vocals": ["vocal", "voz", "jazz", "improvisación", "improvisation"],
    "theory": ["teoría", "theory", "música", "music"],
  };
  const diffMap: Record<string, string[]> = {
    "beginner":     ["beginner", "principiante"],
    "intermediate": ["intermediate", "intermedio"],
    "advanced":     ["advanced", "avanzado"],
    "all":          ["all levels", "todos"],
  };

  const toggleCat = (key: string) => {
    setSelectedCats(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    );
  };

  const clearFilters = () => {
    setSelectedCats([]);
    setSelectedDiff("");
    setSearchQuery("");
  };

  const filteredCourses = allCourses.filter((course) => {
    const titleLower = course.title.toLowerCase();
    const descLower = course.desc.toLowerCase();
    const levelLower = course.level.toLowerCase();

    // Search filter
    if (searchQuery && !titleLower.includes(searchQuery.toLowerCase()) && !descLower.includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Category filter
    if (selectedCats.length > 0) {
      const matchesCat = selectedCats.some(cat => {
        const keywords = catKeywords[cat] || [];
        return keywords.some(kw => titleLower.includes(kw) || descLower.includes(kw));
      });
      if (!matchesCat) return false;
    }

    // Difficulty filter
    if (selectedDiff) {
      const keywords = diffMap[selectedDiff] || [];
      if (!keywords.some(kw => levelLower.includes(kw))) return false;
    }

    return true;
  });

  const images = [
    "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80",
  ];

  const catKeys = ["strings", "keyboards", "vocals", "theory"];
  const catLabels = [t("courses.cats.strings"), t("courses.cats.keyboards"), t("courses.cats.vocals"), t("courses.cats.theory")];
  const diffKeys = ["beginner", "intermediate", "advanced", "all"];
  const diffLabels = [t("courses.diffs.beg"), t("courses.diffs.int"), t("courses.diffs.adv"), "Todos los niveles"];

  const hasFilters = selectedCats.length > 0 || selectedDiff !== "" || searchQuery !== "";

  return (
    <div className="bg-[#F9F8F6] min-h-screen pt-20 pb-32">
      <div className="container mx-auto px-6 max-w-7xl">
        <ScrollAnimation>
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111] mb-4">{t("courses.title")}</h1>
            <p className="text-[#666] max-w-2xl text-lg leading-relaxed">{t("courses.desc")}</p>
          </div>
          {/* Search bar */}
          <div className="relative mb-10 max-w-xl">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cursos..."
              className="w-full pl-11 pr-4 py-3 border border-black/15 bg-white text-sm outline-none focus:border-[#8A6D3B] transition-colors rounded-sm"
            />
          </div>
        </ScrollAnimation>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <ScrollAnimation delay={100}>
              <div className="space-y-10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#111] border-b border-black/10 pb-4 mb-6">{t("courses.catTitle")}</h3>
                  <div className="space-y-4">
                    {catKeys.map((key, i) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer group">
                        <div
                          onClick={() => toggleCat(key)}
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors cursor-pointer ${
                            selectedCats.includes(key) ? "bg-[#8A6D3B] border-[#8A6D3B]" : "border-black/20 bg-white group-hover:border-[#8A6D3B]"
                          }`}>
                          {selectedCats.includes(key) && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5"/>
                            </svg>
                          )}
                        </div>
                        <span className={`text-sm transition-colors ${selectedCats.includes(key) ? "text-[#111] font-medium" : "text-[#666] group-hover:text-[#111]"}`}>
                          {catLabels[i]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#111] border-b border-black/10 pb-4 mb-6">{t("courses.diffTitle")}</h3>
                  <div className="space-y-4">
                    {diffKeys.map((key, i) => (
                      <label key={key} className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedDiff(selectedDiff === key ? "" : key)}>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          selectedDiff === key ? "border-[#8A6D3B] bg-[#8A6D3B]" : "border-black/20 group-hover:border-[#8A6D3B]"
                        }`}>
                          {selectedDiff === key && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className={`text-sm transition-colors ${selectedDiff === key ? "text-[#111] font-medium" : "text-[#666] group-hover:text-[#111]"}`}>
                          {diffLabels[i]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className={`w-full py-3 border border-black/20 text-sm font-medium transition-colors ${
                    hasFilters ? "text-[#8A6D3B] border-[#8A6D3B] hover:bg-[#8A6D3B] hover:text-white" : "text-[#111] hover:bg-black/5"
                  }`}>
                  {t("courses.clear")} {hasFilters && `(${filteredCourses.length})`}
                </button>
              </div>
            </ScrollAnimation>
          </div>

          {/* Course Grid */}
          <div className="lg:w-3/4">
            {filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <svg className="w-16 h-16 text-black/10 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-serif font-bold text-[#111] mb-2">No se encontraron cursos</h3>
                <p className="text-[#888] text-sm mb-6">Intenta con otros filtros o elimínalos.</p>
                <button onClick={clearFilters} className="text-[#8A6D3B] text-sm font-bold underline underline-offset-2">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredCourses.map((course, i) => {
                  // Find original index for consistent image
                  const origIdx = allCourses.findIndex(c => c.title === course.title);
                  const imgSrc = images[origIdx % images.length];
                  return (
                    <ScrollAnimation key={course.title} delay={150 + (i * 50)} className="group bg-white rounded-sm overflow-hidden border border-black/5 hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={imgSrc}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => { (e.target as HTMLImageElement).src = images[0]; }}
                        />
                        <div className="absolute top-4 left-4 bg-[#8A6D3B] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1">
                          {course.level}
                        </div>
                      </div>
                      <div className="p-8">
                        <h3 className="text-2xl font-serif font-bold text-[#111] mb-4">{course.title}</h3>
                        <p className="text-[#666] text-sm leading-relaxed mb-8 h-16 line-clamp-3">{course.desc}</p>
                        <div className="flex items-center justify-between border-t border-black/5 pt-6">
                          <span className="font-bold text-[#111] text-sm">{course.price}</span>
                          <Link href="/enroll" className="text-[#8A6D3B] text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            {t("courses.learnMore")} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                          </Link>
                        </div>
                      </div>
                    </ScrollAnimation>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
