"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();

  // Ocultar Navbar en rutas específicas como el login o dashboard
  if (pathname === "/login" || pathname === "/registro" || pathname?.startsWith("/dashboard") || pathname?.startsWith("/studio") || pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: t("nav.courses"), path: "/courses" },
    { name: t("nav.teachers"), path: "/teachers" },
    { name: t("nav.methodology"), path: "/#methodology" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F9F8F6]/90 backdrop-blur-md border-b border-black/5">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="font-serif text-2xl font-bold tracking-tight text-[#111]">
            Virtuoso Academy
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#444]">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`hover:text-[#9B804E] transition-colors relative ${
                pathname === link.path ? "text-[#9B804E]" : ""
              }`}
            >
              {link.name}
              {pathname === link.path && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#9B804E]" />
              )}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4 text-sm font-medium">
          <button 
            onClick={() => setLanguage(language === "en" ? "es" : "en")}
            className="text-[10px] font-bold uppercase tracking-widest border border-black/20 px-2 py-1 rounded hover:bg-black/5 transition-colors mr-2"
          >
            {language === "en" ? "ES" : "EN"}
          </button>
          <Link href="/login" className="text-[#444] hover:text-[#111] transition-colors hidden sm:block">
            {t("nav.login")}
          </Link>
          <Link
            href="/enroll"
            className="bg-[#111] text-white px-6 py-2.5 rounded hover:bg-[#222] transition-colors shadow-sm"
          >
            {t("nav.enroll")}
          </Link>
        </div>
      </div>
    </header>
  );
}
