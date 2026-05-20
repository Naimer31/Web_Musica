import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Página no encontrada | Virtuoso Academy",
  description: "La página que buscas no existe.",
};

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#F9F8F6] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <p className="text-[10rem] font-serif font-bold text-black/5 leading-none select-none">404</p>

        <div className="-mt-8 relative z-10">
          <h1 className="text-3xl font-serif font-bold text-[#111] mb-4">
            Página no encontrada
          </h1>
          <p className="text-[#666] text-sm leading-relaxed mb-10">
            La página que buscas no existe o ha sido movida. Regresa al inicio o explora nuestro catálogo de cursos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-[#111] text-white text-sm font-bold hover:bg-[#333] transition-colors text-center"
            >
              Ir al Inicio
            </Link>
            <Link
              href="/courses"
              className="w-full sm:w-auto px-8 py-4 border border-black/20 text-[#111] text-sm font-bold hover:bg-black/5 transition-colors text-center"
            >
              Ver Cursos
            </Link>
          </div>
        </div>

        {/* Decorative music note */}
        <div className="mt-16 flex justify-center">
          <svg className="w-12 h-12 text-black/10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
