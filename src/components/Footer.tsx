"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const pathname = usePathname();

  // Ocultar Footer en rutas específicas como el login o dashboard
  if (pathname === "/login" || pathname === "/registro" || pathname?.startsWith("/dashboard") || pathname?.startsWith("/studio") || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-black/5 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <span className="font-serif text-xl font-bold tracking-tight text-[#111] block mb-4">
              Virtuoso Academy
            </span>
            <p className="text-[#666] text-sm leading-relaxed max-w-xs">
              {t("footer.desc")}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-6 text-[#111]">{t("footer.catalog")}</h4>
            <ul className="space-y-4 text-sm text-[#666]">
              <li><Link href="/courses#classical" className="hover:text-[#9B804E] transition-colors">{t("footer.classical")}</Link></li>
              <li><Link href="/courses#jazz" className="hover:text-[#9B804E] transition-colors">{t("footer.jazz")}</Link></li>
              <li><Link href="/courses#production" className="hover:text-[#9B804E] transition-colors">{t("footer.production")}</Link></li>
              <li><Link href="/courses#conducting" className="hover:text-[#9B804E] transition-colors">{t("footer.conducting")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-6 text-[#111]">{t("footer.academy")}</h4>
            <ul className="space-y-4 text-sm text-[#666]">
              <li><Link href="/privacy" className="hover:text-[#9B804E] transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-[#9B804E] transition-colors">{t("footer.terms")}</Link></li>
              <li><Link href="/contact" className="hover:text-[#9B804E] transition-colors">{t("footer.contact")}</Link></li>
              <li><Link href="/careers" className="hover:text-[#9B804E] transition-colors">{t("footer.careers")}</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-6 text-[#111]">{t("footer.newsletter")}</h4>
            <p className="text-[#666] text-sm mb-4">
              {t("footer.newsletterDesc")}
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder={t("footer.placeholder")} 
                className="bg-[#F4F4F4] px-4 py-2.5 text-sm w-full outline-none border border-transparent focus:border-[#9B804E]/50 transition-colors"
              />
              <button className="bg-[#111] text-white px-4 hover:bg-[#333] transition-colors flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center border-t border-black/5 pt-8 text-xs text-[#888]">
          © {new Date().getFullYear()} {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
