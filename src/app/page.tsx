"use client";

import Link from "next/link";
import ScrollAnimation from "@/components/ScrollAnimation";
import { useLanguage } from "@/context/LanguageContext";

import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#F9F8F6] min-h-screen">
      <HeroCarousel />

      {/* Stats Section */}
      <section className="bg-[#111] py-16 text-white border-y border-[#8A6D3B]/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
            <ScrollAnimation>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-2">{t("home.stats.years") || "15+"}</h3>
              <p className="text-sm text-white/70 uppercase tracking-widest">{t("home.stats.yearsLabel") || "Years of Experience"}</p>
            </ScrollAnimation>
            <ScrollAnimation delay={100}>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-2">{t("home.stats.students") || "2000+"}</h3>
              <p className="text-sm text-white/70 uppercase tracking-widest">{t("home.stats.studentsLabel") || "Graduated Students"}</p>
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-2">{t("home.stats.teachers") || "50+"}</h3>
              <p className="text-sm text-white/70 uppercase tracking-widest">{t("home.stats.teachersLabel") || "Expert Teachers"}</p>
            </ScrollAnimation>
            <ScrollAnimation delay={300}>
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#D4AF37] mb-2">{t("home.stats.awards") || "100+"}</h3>
              <p className="text-sm text-white/70 uppercase tracking-widest">{t("home.stats.awardsLabel") || "International Awards"}</p>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-20">
            <div className="md:w-1/3">
              <ScrollAnimation>
                <div className="grid grid-cols-2 gap-4 h-full">
                  <img src="https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?q=80&w=2070&auto=format&fit=crop" alt="Violin" className="w-full h-48 object-cover rounded-sm shadow-md" />
                  <img src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070&auto=format&fit=crop" alt="Sheet Music" className="w-full h-48 object-cover rounded-sm shadow-md mt-12" />
                </div>
              </ScrollAnimation>
            </div>
            <div className="md:w-2/3">
              <ScrollAnimation delay={200}>
                <h2 className="text-4xl font-serif font-bold text-[#111] mb-12">{t("home.methodTitle")}</h2>
                <div className="space-y-10">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-[#F3ECE1] rounded-full flex items-center justify-center shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A6D3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5Z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#111] mb-2">{t("home.method1.title")}</h3>
                      <p className="text-[#666] leading-relaxed">{t("home.method1.desc")}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-[#F3ECE1] rounded-full flex items-center justify-center shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A6D3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#111] mb-2">{t("home.method2.title")}</h3>
                      <p className="text-[#666] leading-relaxed">{t("home.method2.desc")}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="w-12 h-12 bg-[#F3ECE1] rounded-full flex items-center justify-center shrink-0">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8A6D3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#111] mb-2">{t("home.method3.title")}</h3>
                      <p className="text-[#666] leading-relaxed">{t("home.method3.desc")}</p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Disciplines */}
      <section className="py-24 bg-[#F9F8F6]">
        <div className="container mx-auto px-6 text-center">
          <ScrollAnimation>
            <h2 className="text-4xl font-serif font-bold text-[#111] mb-6">{t("home.featTitle")}</h2>
            <p className="text-[#666] max-w-2xl mx-auto mb-16">{t("home.featDesc")}</p>
          </ScrollAnimation>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <ScrollAnimation className="md:col-span-2 group relative overflow-hidden rounded-sm cursor-pointer" delay={100}>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
              <img src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop" alt="Classical Piano" className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 p-8 z-20 text-left">
                <span className="bg-[#8A6D3B] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 mb-3 inline-block">{t("home.mostPopular")}</span>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">{t("home.classPiano")}</h3>
                <p className="text-white/80 text-sm">{t("home.classPianoDesc")}</p>
              </div>
            </ScrollAnimation>
            
            <div className="flex flex-col gap-6">
              <ScrollAnimation className="group relative overflow-hidden rounded-sm cursor-pointer h-full" delay={200}>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <img src="https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?q=80&w=2070&auto=format&fit=crop" alt="Strings" className="w-full h-full min-h-[188px] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 p-6 z-20 text-left">
                  <h3 className="text-xl font-serif font-bold text-white mb-1">{t("home.strings")}</h3>
                  <p className="text-white/80 text-xs">{t("home.stringsDesc")}</p>
                </div>
              </ScrollAnimation>
              
              <ScrollAnimation className="group relative overflow-hidden rounded-sm cursor-pointer h-full" delay={300}>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070&auto=format&fit=crop" alt="Vocals" className="w-full h-full min-h-[188px] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 p-6 z-20 text-left">
                  <h3 className="text-xl font-serif font-bold text-white mb-1">{t("home.vocals")}</h3>
                  <p className="text-white/80 text-xs">{t("home.vocalsDesc")}</p>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Community / Testimonial */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/3">
              <ScrollAnimation>
                <h2 className="text-3xl font-serif font-bold text-[#111] mb-4">{t("home.commTitle")}</h2>
                <p className="text-[#666] mb-8">{t("home.commDesc")}</p>
                <div className="flex gap-4">
                  <button className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/5 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/5 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              </ScrollAnimation>
            </div>
            
            <div className="md:w-2/3">
              <ScrollAnimation delay={200} className="bg-[#F9F8F6] p-12 rounded-sm relative">
                <svg className="absolute top-8 left-8 text-[#8A6D3B]/20 w-16 h-16" fill="currentColor" viewBox="0 0 32 32"><path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"/></svg>
                <div className="relative z-10 pl-8 pt-4">
                  <p className="text-xl font-serif text-[#111] italic leading-relaxed mb-8">
                    {t("home.quote")}
                  </p>
                  <div className="flex items-center gap-4">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" alt="Elena Rustova" className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-[#111] text-sm">Elena Rustova</h4>
                      <p className="text-[#666] text-xs">{t("home.studentRole")}</p>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-[#F3ECE1]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <ScrollAnimation className="max-w-2xl">
              <h2 className="text-4xl font-serif font-bold text-[#111] mb-4">{t("home.eventsTitle") || "Upcoming Events"}</h2>
              <p className="text-[#666]">{t("home.eventsDesc") || "Join us in our upcoming masterclasses, recitals, and special presentations."}</p>
            </ScrollAnimation>
            <ScrollAnimation delay={200}>
              <Link href="/events" className="hidden md:inline-block border-b border-[#8A6D3B] text-[#8A6D3B] font-medium pb-1 hover:text-[#111] hover:border-[#111] transition-colors">
                {t("courses.learnMore") || "View All Events"}
              </Link>
            </ScrollAnimation>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num, i) => (
              <ScrollAnimation key={num} delay={i * 100} className="bg-white p-8 group hover:shadow-xl transition-all border border-transparent hover:border-[#8A6D3B]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#8A6D3B]/5 rounded-bl-full -z-0 transition-transform group-hover:scale-150" />
                <div className="relative z-10">
                  <div className="text-[#8A6D3B] font-bold text-sm tracking-widest mb-4">
                    {t(`home.event${num}.date`)}
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#111] mb-4 group-hover:text-[#8A6D3B] transition-colors">
                    {t(`home.event${num}.title`)}
                  </h3>
                  <div className="flex items-center text-[#666] text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    {t(`home.event${num}.location`)}
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#111] py-24 text-center text-white">
        <ScrollAnimation>
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-serif font-bold mb-6">{t("home.ctaTitle")}</h2>
            <p className="text-white/60 mb-10 max-w-xl mx-auto">
              {t("home.ctaDesc")}
            </p>
            <Link href="/enroll" className="bg-[#8A6D3B] text-white px-8 py-4 text-sm font-medium hover:bg-[#6D552E] transition-colors inline-block">
              {t("home.ctaBtn")}
            </Link>
          </div>
        </ScrollAnimation>
      </section>
    </div>
  );
}
