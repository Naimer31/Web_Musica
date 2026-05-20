"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, TranslationKey } from "@/lib/translations";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: TranslationKey) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("virtuoso-lang") as Language;
    const targetLang = (savedLang && (savedLang === "en" || savedLang === "es"))
      ? savedLang
      : (navigator.language.startsWith("es") ? "es" : "en");
    
    Promise.resolve().then(() => {
      setLanguage(targetLang);
      setMounted(true);
    });
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("virtuoso-lang", lang);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (key: TranslationKey): any => {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value === undefined) break;
      value = value[k];
    }
    
    return value || key;
  };

  // Prevent hydration mismatch by rendering default (or nothing) until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-[#F9F8F6]"></div>;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
