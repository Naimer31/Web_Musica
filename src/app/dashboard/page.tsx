"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  LayoutDashboard, BookOpen, BarChart3, Settings, HelpCircle,
  Search, Bell, Video, Calendar
} from "lucide-react";

interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface Profile {
  id: string;
  full_name: string | null;
  role: string | null;
  instrument?: string | null;
}

interface Lesson {
  id: string;
  student_id: string;
  teacher_id: string;
  title: string;
  scheduled_at: string;
  duration_minutes: number;
  is_completed: boolean;
  teacher?: {
    full_name: string | null;
  } | null;
}

export default function StudentDashboard() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teachers, setTeachers] = useState<Profile[]>([]);
  const [myLessons, setMyLessons] = useState<Lesson[]>([]);
  
  // Booking Form State
  const [showBooking, setShowBooking] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [bookingTitle, setBookingTitle] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingDuration, setBookingDuration] = useState("60");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData);

      // Fetch teachers
      const { data: teachersData } = await supabase.from("profiles").select("*").eq("role", "teacher");
      if (teachersData) setTeachers(teachersData);

      // Fetch student's booked lessons (assuming we added student_id to lessons)
      const { data: lessonsData } = await supabase
        .from("lessons")
        .select("*, teacher:profiles!lessons_teacher_id_fkey(full_name)")
        .eq("student_id", user.id)
        .order("scheduled_at", { ascending: true });
        
      if (lessonsData) setMyLessons(lessonsData);
    };
    load();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTeacher || !bookingDate || !bookingTitle) return;
    
    setIsBooking(true);
    try {
      const { data, error } = await supabase.from("lessons").insert([
        {
          student_id: user.id,
          teacher_id: selectedTeacher,
          title: bookingTitle,
          scheduled_at: bookingDate,
          duration_minutes: parseInt(bookingDuration),
          is_completed: false
        }
      ]).select("*, teacher:profiles!lessons_teacher_id_fkey(full_name)").single();

      if (error) {
        // Fallback if student_id column doesn't exist yet: insert without it or alert
        alert("Asegúrate de haber ejecutado el nuevo código SQL para añadir 'student_id' a las lecciones.");
        console.error(error);
      } else if (data) {
        setMyLessons([...myLessons, data]);
        setShowBooking(false);
        setBookingTitle("");
        setBookingDate("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Estudiante";
  const firstName = displayName.split(" ")[0];
  const avatarLetter = firstName.charAt(0).toUpperCase();

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
              <p className="text-[9px] uppercase tracking-widest text-[#8A6D3B] mt-0.5">Portal del Alumno</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Mi Panel", active: true },
            { icon: BookOpen, label: "Mis Cursos", active: false },
            { icon: Calendar, label: "Calendario", active: false },
            { icon: BarChart3, label: "Progreso", active: false },
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
          <button 
            onClick={() => setShowBooking(true)}
            className="w-full bg-[#111] text-white py-3 px-4 text-sm font-medium hover:bg-[#222] transition-colors flex items-center justify-center gap-2"
          >
            Reservar Clase
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
              placeholder="Buscar clases, profesores..." 
              className="w-full bg-[#EAE8E2]/50 border-none rounded-sm pl-10 pr-4 py-2.5 text-sm text-[#111] placeholder:text-[#111]/40 focus:ring-1 focus:ring-[#8A6D3B] outline-none"
            />
          </div>
          <div className="flex items-center gap-5">
            <button className="text-[#111]/60 hover:text-[#111] transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-[#EAE8E2] overflow-hidden border border-[#D5D2C8] flex items-center justify-center font-serif text-sm cursor-pointer" title="Cerrar sesión">
              {avatarLetter}
            </button>
          </div>
        </header>

        <div className="p-10 max-w-5xl mx-auto space-y-10">
          
          {/* Welcome Text */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-5xl font-serif font-bold text-[#111] mb-3 tracking-tight">Hola, {firstName}</h2>
              <p className="text-[#111]/70">La disciplina de hoy es la obra maestra de mañana. Tienes clases pendientes.</p>
            </div>
            <button 
              onClick={() => setShowBooking(!showBooking)}
              className="bg-[#8A6D3B] text-white px-6 py-3 text-sm font-medium hover:bg-[#7A5D2B] transition-colors shadow-lg shadow-[#8A6D3B]/20"
            >
              {showBooking ? "Ocultar Reservas" : "Elegir Profesor y Reservar"}
            </button>
          </div>

          {/* Booking Section */}
          {showBooking && (
            <div className="bg-white border border-[#8A6D3B]/30 p-8 shadow-sm">
              <h3 className="text-2xl font-serif font-bold text-[#111] mb-6">Reserva tu Clase Privada</h3>
              <form onSubmit={handleBookSession} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#111]/70 mb-2">1. Elegir Profesor</label>
                  <select 
                    required
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    className="w-full border border-[#EAE8E2] p-3 text-sm focus:border-[#8A6D3B] outline-none bg-transparent"
                  >
                    <option value="">Selecciona un maestro...</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.full_name} ({t.instrument || 'Música'})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#111]/70 mb-2">2. Tema de la Clase</label>
                  <input 
                    required
                    type="text" 
                    value={bookingTitle}
                    onChange={(e) => setBookingTitle(e.target.value)}
                    placeholder="Ej. Revisión de Partitura de Chopin"
                    className="w-full border border-[#EAE8E2] p-3 text-sm focus:border-[#8A6D3B] outline-none bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#111]/70 mb-2">3. Fecha y Hora</label>
                  <input 
                    required
                    type="datetime-local" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full border border-[#EAE8E2] p-3 text-sm focus:border-[#8A6D3B] outline-none bg-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#111]/70 mb-2">4. Duración (Tiempo Limitado)</label>
                  <select 
                    value={bookingDuration}
                    onChange={(e) => setBookingDuration(e.target.value)}
                    className="w-full border border-[#EAE8E2] p-3 text-sm focus:border-[#8A6D3B] outline-none bg-transparent"
                  >
                    <option value="30">30 Minutos (Evaluación rápida)</option>
                    <option value="45">45 Minutos (Práctica estándar)</option>
                    <option value="60">60 Minutos (Clase magistral)</option>
                    <option value="90">90 Minutos (Inmersión profunda)</option>
                  </select>
                </div>
                <div className="md:col-span-2 mt-4">
                  <button 
                    type="submit" 
                    disabled={isBooking}
                    className="bg-[#111] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#222] transition-colors w-full disabled:opacity-50"
                  >
                    {isBooking ? "Confirmando Reserva..." : "Confirmar Reserva de Clase"}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Session / Upcoming Classes */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#111]">Tus Próximas Clases</h3>
              
              {myLessons.length === 0 ? (
                <div className="bg-white border border-[#EAE8E2] p-10 text-center text-[#111]/50">
                  No tienes clases programadas. Utiliza el botón de arriba para elegir un profesor y reservar tu tiempo.
                </div>
              ) : (
                <div className="space-y-4">
                  {myLessons.map((lesson, idx) => {
                    const date = new Date(lesson.scheduled_at);
                    return (
                      <div key={idx} className="bg-[#111] text-white p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center relative overflow-hidden group">
                        <div className="relative z-10">
                          <span className="inline-block bg-[#8A6D3B] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 mb-4">
                            Clase de {lesson.duration_minutes} min
                          </span>
                          <h3 className="text-2xl font-serif font-bold mb-2">{lesson.title}</h3>
                          <p className="text-white/60 text-sm">Profesor: {lesson.teacher?.full_name} · Estudio Virtual</p>
                        </div>
                        
                        <div className="relative z-10 mt-6 sm:mt-0 flex gap-6 items-center">
                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">Fecha</p>
                            <p className="text-xl font-serif font-bold">{date.toLocaleDateString()}</p>
                            <p className="text-sm text-[#8A6D3B]">{date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                          <button className="bg-white text-[#111] font-bold uppercase tracking-wider text-xs px-6 py-4 flex items-center gap-3 hover:bg-[#EAE8E2] transition-colors">
                            <Video className="w-4 h-4" /> Entrar a Clase
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quarterly Progress */}
            <div className="bg-white border border-[#EAE8E2] p-8 text-center flex flex-col items-center justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#111]/50 mb-6">Progreso del Semestre</p>
              
              <div className="relative w-36 h-36 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#EAE8E2" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8A6D3B" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="62.8" strokeLinecap="square" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-serif font-bold text-[#111] leading-none">75<span className="text-2xl">%</span></span>
                  <span className="text-[9px] text-[#111]/40 uppercase tracking-widest mt-1">Dominio</span>
                </div>
              </div>

              <h4 className="text-xl font-serif font-bold text-[#111] mb-2">Nivel Oro Alcanzado</h4>
              <p className="text-xs text-[#111]/60 leading-relaxed px-4">Estás en el 5% superior de estudiantes este semestre. ¡Sigue así!</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
