"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Newspaper,
  LogOut,
  Music,
  Settings,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Resumen", href: "/admin" },
  { icon: Users, label: "Usuarios", href: "/admin/users" },
  { icon: ClipboardList, label: "Solicitudes", href: "/admin/requests" },
  { icon: BookOpen, label: "Cursos", href: "/admin/courses" },
  { icon: Newspaper, label: "Publicaciones", href: "/admin/posts" },
  { icon: Settings, label: "Configuración", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#111] border-r border-white/5 z-50 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#8A6D3B] flex items-center justify-center rounded-sm">
            <Music className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-serif font-bold text-sm">Virtuoso</span>
            <span className="text-[#8A6D3B] text-[10px] font-bold uppercase tracking-widest block -mt-1">Admin</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#8A6D3B]/20 text-[#C4A265] border-l-2 border-[#8A6D3B]"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-2.5 text-white/40 hover:text-white text-sm transition-all rounded-sm hover:bg-white/5 mb-1"
        >
          <Music className="w-4 h-4" />
          Ver sitio web
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400/60 hover:text-red-400 text-sm transition-all rounded-sm hover:bg-red-400/10"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
