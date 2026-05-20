"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScrollAnimation from "@/components/ScrollAnimation";
import { useLanguage } from "@/context/LanguageContext";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=2070&auto=format&fit=crop",
    titleKey1: "home.heroTitle1",
    titleKey2: "home.heroTitle2",
    descKey: "home.heroDesc",
    btn1Key: "home.applyBtn",
    btn1Link: "/courses",
    btn2Key: "home.bookBtn",
    btn2Link: "/enroll"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070&auto=format&fit=crop",
    titleKey1: "home.slider2Title1",
    titleKey2: "home.slider2Title2",
    descKey: "home.slider2Desc",
    btn1Key: "home.slider2Btn",
    btn1Link: "/teachers",
    btn2Key: "home.bookBtn",
    btn2Link: "/enroll"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop",
    titleKey1: "home.slider3Title1",
    titleKey2: "home.slider3Title2",
    descKey: "home.slider3Desc",
    btn1Key: "home.slider3Btn",
    btn1Link: "/courses",
    btn2Key: "home.bookBtn",
    btn2Link: "/enroll"
  }
];

export default function HeroCarousel() {
  const { t } = useLanguage();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, []);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000); // Auto-slide every 6 seconds
    return () => clearInterval(interval);
  }, [nextSlide, isHovered]);

  return (
    <div 
      className="relative w-full h-[90vh] min-h-[600px] overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides */}
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="w-full h-full shrink-0 relative">
            <div className="absolute inset-0 bg-black/50 z-10" /> {/* Dark Overlay */}
            <img 
              src={slide.image} 
              alt="Slide image" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl">
                  {/* We use a key to force re-animation when slide changes */}
                  <ScrollAnimation key={`anim-${index}-${current}`}>
                    <h4 className="text-[#D4AF37] font-bold tracking-widest text-xs uppercase mb-6 drop-shadow-md">
                      {t("home.heroOver")}
                    </h4>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-8 drop-shadow-lg">
                      {t(slide.titleKey1)} <br className="hidden md:block"/>{t(slide.titleKey2)}
                    </h1>
                    <p className="text-gray-200 text-lg mb-10 max-w-lg leading-relaxed drop-shadow-md">
                      {t(slide.descKey)}
                    </p>
                    <div className="flex items-center gap-4">
                      <Link href={slide.btn1Link} className="bg-[#8A6D3B] text-white px-8 py-4 text-sm font-medium hover:bg-[#6D552E] transition-colors shadow-lg shadow-[#8A6D3B]/20">
                        {t(slide.btn1Key)}
                      </Link>
                      <Link href={slide.btn2Link} className="bg-transparent border border-white/50 text-white px-8 py-4 text-sm font-medium hover:bg-white/10 transition-colors">
                        {t(slide.btn2Key)}
                      </Link>
                    </div>
                  </ScrollAnimation>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              current === index 
                ? "bg-white scale-125 shadow-lg" 
                : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
