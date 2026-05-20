"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollAnimation({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right";
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getAnimationClass = () => {
    if (!isVisible) return "opacity-0 translate-y-8";
    switch (animation) {
      case "fade-up":
        return "opacity-100 translate-y-0 transition-all duration-1000 ease-out";
      case "fade-in":
        return "opacity-100 transition-opacity duration-1000 ease-out";
      case "slide-left":
        return "opacity-100 translate-x-0 transition-all duration-1000 ease-out";
      case "slide-right":
        return "opacity-100 translate-x-0 transition-all duration-1000 ease-out";
      default:
        return "opacity-100 transition-all duration-1000 ease-out";
    }
  };

  const initialClass = !isVisible && animation === "slide-left" ? "opacity-0 translate-x-8" : 
                       !isVisible && animation === "slide-right" ? "opacity-0 -translate-x-8" : 
                       !isVisible ? "opacity-0 translate-y-8" : "";

  return (
    <div
      ref={ref}
      className={`${className} ${getAnimationClass()} ${!isVisible ? initialClass : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
