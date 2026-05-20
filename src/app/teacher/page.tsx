"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  LayoutDashboard, Users, BookOpen, BarChart3, Settings, HelpCircle,
  Search, Bell, CheckCircle2
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type Profile = {
  full_name: string | null;
  role: string;
};

type Lesson = {
  id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  is_completed: boolean;
  student: {
    full_name: string | null;
  } | null;
};

export default function TeacherDashboard() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mySchedule, setMySchedule] = useState<Lesson[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData as Profile);

      // Fetch teacher's scheduled lessons
      const { data: scheduleData } = await supabase
        .from("lessons")
        .select("*, student:profiles!lessons_student_id_fkey(full_name)")
        .eq("teacher_id", user.id)
        .order("scheduled_at", { ascending: true });

      if (scheduleData) setMySchedule(scheduleData as Lesson[]);
    };
    load();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleMarkCompleted = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({ is_completed: true })
        .eq('id', lessonId);

      if (error) {
        console.error("Error updating lesson status:", error);
        alert("Hubo un error al marcar la clase como completada.");
        return;
      }

      setMySchedule(prevSchedule => 
        prevSchedule.map(session => 
          session.id === lessonId 
            ? { ...session, is_completed: true } 
            : session
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Maestro";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#111] font-sans flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-64 bg-[#F9F8F6] border-r border-[#EAE8E2] z-50 flex flex-col">
        <div className="h-24 flex items-center px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#111] rounded flex items-center justify-center">
              <span className="text-[#F9F8F6] font-serif text-lg leading-none">V</span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg leading-tight">Virtuoso<br/>Academy</h1>
              <p className="text-[9px] uppercase tracking-widest text-[#8A6D3B] mt-0.5">Portal del Maestro</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Mi Panel", active: true },
            { icon: Users, label: "Estudiantes", active: false },
            { icon: BookOpen, label: "Currículo", active: false },
            { icon: BarChart3, label: "Analíticas", active: false },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-4 px-8 py-3 text-sm transition-all ${
              item.active 
                ? "text-[#8A6D3B] bg-gradient-to-r from-[#8A6D3B]/10 to-transparent border-l-4 border-[#8A6D3B] font-medium" 
                : "text-[#111]/60 hover:text-[#111] hover:bg-[#111]/5 border-l-4 border-transparent"
            }`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-4">
          <button className="w-full bg-[#111] text-white py-3 px-4 text-sm font-medium hover:bg-[#222] transition-colors flex items-center justify-center gap-2">
            <span className="text-lg leading-none">+</span> Nueva Sesión
          </button>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-4 px-2 py-2 text-sm text-[#111]/60 hover:text-[#111] transition-colors">
              <Settings className="w-4 h-4" /> Configuración
            </button>
            <button className="w-full flex items-center gap-4 px-2 py-2 text-sm text-[#111]/60 hover:text-[#111] transition-colors">
              <HelpCircle className="w-4 h-4" /> Soporte
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        {/* Top Header */}
        <header className="h-20 border-b border-[#EAE8E2] px-10 flex items-center justify-between bg-[#F9F8F6] sticky top-0 z-40">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111]/40" />
            <input 
              type="text" 
              placeholder="Buscar perfiles de estudiantes o partituras..." 
              className="w-full bg-[#EAE8E2]/50 border-none rounded-sm pl-10 pr-4 py-2.5 text-sm text-[#111] placeholder:text-[#111]/40 focus:ring-1 focus:ring-[#8A6D3B] outline-none"
            />
          </div>
          <div className="flex items-center gap-5">
            <button className="text-[#111]/60 hover:text-[#111] transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-[#EAE8E2] overflow-hidden border border-[#D5D2C8] flex items-center justify-center font-serif text-sm cursor-pointer" title="Cerrar Sesión">
              {avatarLetter}
            </button>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-10">
            <h2 className="text-4xl font-serif font-bold text-[#111] mb-2 tracking-tight">Resumen del Maestro</h2>
            <p className="text-[#111]/60 text-sm">Bienvenido de nuevo, {displayName.split(' ')[0]}. Tienes {mySchedule.length} sesiones programadas.</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Stat 1 */}
            <div className="bg-white border border-[#EAE8E2] p-6 flex flex-col justify-between h-36">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#111]/50">Estudiantes Totales</p>
              <p className="text-4xl font-serif font-bold text-[#111]">24</p>
              <div className="flex items-center gap-2 text-[11px] text-[#8A6D3B] font-medium">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                +2 desde el mes pasado
              </div>
            </div>
            {/* Stat 2 */}
            <div className="bg-white border border-[#EAE8E2] p-6 flex flex-col justify-between h-36">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#111]/50">Clases Pendientes</p>
              <p className="text-4xl font-serif font-bold text-[#111]">{mySchedule.length}</p>
              <div className="text-[11px] text-[#111]/50">
                Revisa tu horario a continuación
              </div>
            </div>
            {/* Stat 3 */}
            <div className="bg-white border border-[#EAE8E2] p-6 flex flex-col justify-between h-36">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#111]/50">Progreso Promedio</p>
              <p className="text-4xl font-serif font-bold text-[#111]">82%</p>
              <div className="w-full h-1 bg-[#EAE8E2] mt-auto">
                <div className="h-full bg-[#8A6D3B]" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column - Schedule & Spotlight */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Today's Schedule */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-serif font-bold text-[#111]">Tus Próximas Reservas</h3>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-[#111]/50 hover:text-[#111] transition-colors">Ver Calendario</button>
                </div>
                <div className="space-y-3">
                  {mySchedule.length === 0 ? (
                    <div className="bg-white border border-[#EAE8E2] p-8 text-center text-[#111]/50">
                      No tienes reservas de alumnos por el momento.
                    </div>
                  ) : (
                    mySchedule.map((session, i) => {
                      const date = new Date(session.scheduled_at);
                      return (
                        <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 bg-white border border-[#EAE8E2] group hover:border-[#D5D2C8] transition-colors">
                          <div className="text-center sm:w-24 shrink-0 border-r border-[#EAE8E2] pr-6">
                            <p className="text-[10px] font-bold text-[#111]/40 uppercase mb-1">{date.toLocaleDateString()}</p>
                            <p className="text-lg font-serif font-bold text-[#111] leading-none mb-1">{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-[#111] text-sm">{session.student?.full_name || "Alumno Desconocido"}</p>
                            <p className="text-xs text-[#111]/50 mt-0.5">{session.title} · {session.duration_minutes} Minutos</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 ${session.is_completed ? 'bg-[#EAE8E2]/50 text-[#111]/40' : 'bg-[#8A6D3B]/10 text-[#8A6D3B]'}`}>
                              {session.is_completed ? 'COMPLETADA' : 'PENDIENTE'}
                            </span>
                            {session.is_completed ? (
                              <CheckCircle2 className="w-5 h-5 text-[#111]/20" />
                            ) : (
                              <button 
                                onClick={() => handleMarkCompleted(session.id)}
                                title="Marcar clase como completada"
                                className="w-8 h-8 flex items-center justify-center text-[#8A6D3B]/50 hover:text-[#8A6D3B] hover:bg-[#8A6D3B]/10 rounded-full transition-colors"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </section>

              {/* Studio Spotlight */}
              <section className="bg-white border border-[#EAE8E2] p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 aspect-square relative bg-[#111]">
                  <img 
                    src="https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?auto=format&fit=crop&q=80&w=800" 
                    alt="Cello player" 
                    className="w-full h-full object-cover grayscale opacity-90"
                  />
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A6D3B] mb-3">Estudiante Destacado</p>
                  <h3 className="text-4xl font-serif font-bold text-[#111] mb-4">Julianne Vivaldi</h3>
                  <p className="text-sm text-[#111]/70 leading-relaxed mb-8">
                    Julianne ha demostrado una disciplina excepcional para dominar las &quot;Suites para violonchelo de Bach&quot;. Su reciente presentación muestra una profunda comprensión del fraseo barroco.
                  </p>
                  <div className="flex items-center gap-3">
                    <button className="bg-[#111] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#222] transition-colors">
                      Ver Perfil
                    </button>
                    <button className="bg-transparent border border-[#EAE8E2] text-[#111] px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#F9F8F6] transition-colors">
                      Asignar Pieza
                    </button>
                  </div>
                </div>
              </section>

            </div>

            {/* Right Column - Recent Activity */}
            <div className="space-y-6">
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-serif font-bold text-[#111]">Actividad Reciente</h3>
              </div>
              
              <div className="bg-white border border-[#EAE8E2] p-6">
                <div className="relative border-l border-[#EAE8E2] ml-3 space-y-8 pb-4">
                  {/* Item 1 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-[#8A6D3B] rounded-full border-2 border-white"></div>
                    <p className="text-sm text-[#111]/80 leading-snug">
                      <span className="font-semibold text-[#111]">Julianne Vivaldi</span> envió una grabación del &apos;Concierto de Cello de Elgar&apos; para revisión.
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#111]/40 mt-2 mb-3">HACE 2 HORAS</p>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-[#8A6D3B] hover:text-[#111] transition-colors">
                      Revisar Pieza
                    </button>
                  </div>
                  {/* Item 2 */}
                  <div className="relative pl-6">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-[#D5D2C8] rounded-full border-2 border-white"></div>
                    <p className="text-sm text-[#111]/80 leading-snug">
                      <span className="font-semibold text-[#111]">Nueva Inscripción:</span> Aaron Copland (Composición) asignado a tu estudio.
                    </p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#111]/40 mt-2">AYER, 4:45 PM</p>
                  </div>
                </div>
                
                <button className="w-full mt-4 py-3 border border-[#EAE8E2] text-[10px] font-bold uppercase tracking-widest text-[#111]/50 hover:bg-[#F9F8F6] hover:text-[#111] transition-colors">
                  Historial Completo
                </button>
              </div>

              {/* Practice Tracking Card */}
              <div className="bg-[#111] text-white p-6 relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-sm font-bold mb-2">Seguimiento de Práctica</h4>
                  <p className="text-xs text-white/60 leading-relaxed">Asegúrate de que los estudiantes registren sus horas a través de la aplicación móvil de Virtuoso para la sincronización del progreso en tiempo real.</p>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-[16px] border-white/5 rounded-full"></div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
