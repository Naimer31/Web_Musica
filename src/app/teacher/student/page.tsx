"use client";

import Link from "next/link";
import {
  LayoutDashboard, Users, BookOpen, BarChart3, Settings, HelpCircle,
  Search, Bell, FileText, Video
} from "lucide-react";

export default function StudentDetailView() {
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
              <p className="text-[9px] uppercase tracking-widest text-[#8A6D3B] mt-0.5">Academic Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: false },
            { icon: Users, label: "Students", active: true },
            { icon: BookOpen, label: "Curriculum", active: false },
            { icon: BarChart3, label: "Analytics", active: false },
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
            New Session
          </button>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-4 px-2 py-2 text-sm text-[#111]/60 hover:text-[#111] transition-colors">
              <Settings className="w-4 h-4" /> Settings
            </button>
            <button className="w-full flex items-center gap-4 px-2 py-2 text-sm text-[#111]/60 hover:text-[#111] transition-colors">
              <HelpCircle className="w-4 h-4" /> Support
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
              placeholder="Search records..." 
              className="w-full bg-[#EAE8E2]/50 border-none rounded-sm pl-10 pr-4 py-2.5 text-sm text-[#111] placeholder:text-[#111]/40 focus:ring-1 focus:ring-[#8A6D3B] outline-none"
            />
          </div>
          <div className="flex items-center gap-5">
            <button className="bg-[#8A6D3B] text-white px-5 py-2 text-sm font-medium hover:bg-[#7A5D2B] transition-colors">
              Apply Now
            </button>
            <button className="text-[#111]/60 hover:text-[#111] transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#EAE8E2] overflow-hidden border border-[#D5D2C8] flex items-center justify-center font-serif text-sm">
              M
            </button>
          </div>
        </header>

        <div className="p-10 max-w-5xl mx-auto space-y-8">
          
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 bg-[#EAE8E2] shrink-0 border border-[#D5D2C8]">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" alt="Mateo Garcia" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-5xl font-serif font-bold text-[#111] leading-tight mb-4">Mateo<br/>García</h2>
                <div className="flex items-center gap-4">
                  <span className="bg-[#F3E8CE] text-[#8A6D3B] text-xs font-bold px-4 py-1.5">Strings & Keys</span>
                  <span className="text-[#111]/50 text-xs flex items-center gap-1.5 border border-[#EAE8E2] px-4 py-1.5">
                    <BookOpen className="w-3 h-3" /> Year 3 Virtuoso Path
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 border border-[#EAE8E2] text-xs font-bold uppercase tracking-wider text-[#111] hover:bg-[#F9F8F6] transition-colors">
                Download Report
              </button>
              <button className="px-6 py-3 bg-[#111] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-[#222] transition-colors">
                <Video className="w-4 h-4" /> Start Session
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Growth Trajectory Line Chart */}
            <div className="lg:col-span-2 bg-white border border-[#EAE8E2] p-8 flex flex-col h-72">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#111] mb-1">Growth Trajectory</h3>
                  <p className="text-sm text-[#111]/50">Technical vs. Expressive Performance</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#8A6D3B]"></span> Technical
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#111]"></span> Expressive
                  </div>
                </div>
              </div>
              
              <div className="relative flex-1 mt-auto h-full border-b border-[#EAE8E2] flex items-end">
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,80 Q25,75 50,65 T100,50" fill="none" stroke="#8A6D3B" strokeWidth="2" />
                  <path d="M0,85 Q25,82 50,75 T100,60" fill="none" stroke="#111" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-[#111]/40 mt-4">
                <span>Sept</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span>
              </div>
            </div>

            {/* Right side stats */}
            <div className="space-y-6">
              <div className="bg-[#FDFBF7] border border-[#EAE8E2] p-8 text-center h-32 flex flex-col justify-center relative overflow-hidden">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#111]/50 mb-3 relative z-10">Practice Consistency</p>
                <div className="flex items-end justify-center gap-2 relative z-10">
                  <p className="text-4xl font-serif font-bold text-[#111]">94<span className="text-xl">%</span></p>
                  <span className="text-[#8A6D3B] text-[10px] font-bold uppercase tracking-widest mb-1.5">+12% vs last term</span>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#8A6D3B]"></div>
              </div>
              
              <div className="bg-white border border-[#EAE8E2] p-8 text-center h-32 flex flex-col justify-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#111]/50 mb-3">Repertoire Mastery</p>
                <div className="flex items-center justify-center gap-4">
                  <p className="text-4xl font-serif font-bold text-[#111]">14</p>
                  <p className="text-xs text-[#111]/50 text-left leading-tight">Pieces<br/>Polished</p>
                </div>
                <div className="flex justify-center mt-3 gap-1">
                  <span className="w-5 h-5 rounded-full bg-[#EAE8E2] text-[8px] flex items-center justify-center font-bold">CH</span>
                  <span className="w-5 h-5 rounded-full bg-[#EAE8E2] text-[8px] flex items-center justify-center font-bold">BT</span>
                  <span className="w-5 h-5 rounded-full bg-[#EAE8E2] text-[8px] flex items-center justify-center font-bold">DB</span>
                  <span className="w-5 h-5 rounded-full bg-[#111] text-white text-[8px] flex items-center justify-center font-bold">+11</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Practice Logs */}
          <div className="bg-white border border-[#EAE8E2] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-serif font-bold text-[#111]">Recent Practice Logs</h3>
              <button className="text-[10px] font-bold uppercase tracking-widest text-[#8A6D3B] hover:text-[#111] transition-colors flex items-center gap-1">
                View Full History <span className="text-[12px]">→</span>
              </button>
            </div>
            
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#EAE8E2]">
                  <th className="pb-4 text-[9px] font-bold uppercase tracking-widest text-[#111]/50 w-[15%]">Date</th>
                  <th className="pb-4 text-[9px] font-bold uppercase tracking-widest text-[#111]/50 w-[35%]">Focus Area</th>
                  <th className="pb-4 text-[9px] font-bold uppercase tracking-widest text-[#111]/50 w-[15%]">Duration</th>
                  <th className="pb-4 text-[9px] font-bold uppercase tracking-widest text-[#111]/50 w-[20%]">Self-Rating</th>
                  <th className="pb-4 text-[9px] font-bold uppercase tracking-widest text-[#111]/50 w-[15%]">Recording</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE8E2]">
                {[
                  { date: "Feb 24, 2024", focus: "Chopin - Etude Op. 10 No. 4", duration: "120 mins", rating: 4 },
                  { date: "Feb 22, 2024", focus: "Scales: C Major & A Minor", duration: "45 mins", rating: 5 },
                  { date: "Feb 20, 2024", focus: "Bach - Prelude in C Major", duration: "90 mins", rating: 3 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-[#F9F8F6] transition-colors">
                    <td className="py-4 text-[#111]/60 text-xs">{row.date}</td>
                    <td className="py-4 font-semibold text-[#111] text-xs">{row.focus}</td>
                    <td className="py-4 text-[#111]/60 text-xs">{row.duration}</td>
                    <td className="py-4 flex gap-1 items-center h-full mt-3">
                      {[1,2,3,4,5].map(star => (
                        <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= row.rating ? "#8A6D3B" : "none"} stroke={star <= row.rating ? "#8A6D3B" : "#D5D2C8"} strokeWidth="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </td>
                    <td className="py-4">
                      <button className="w-6 h-6 rounded-full border border-[#111] flex items-center justify-center hover:bg-[#111] hover:text-white transition-colors">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assigned Weekly Tasks */}
            <div className="bg-white border border-[#EAE8E2] p-8">
              <h3 className="text-xl font-serif font-bold text-[#111] mb-6">Assigned Weekly Tasks</h3>
              <div className="space-y-6">
                {[
                  { title: "Articulation Mastery", desc: "Focus on the staccato sections in the Chopin Etude. Keep the wrist relaxed.", done: true },
                  { title: "Dynamic Contrast", desc: "Increase the difference between the piano and forte sections in Bach.", done: false },
                  { title: "Metronome Discipline", desc: "Practice measures 14-28 at 60 BPM until rhythm is consistent.", done: false },
                ].map((task, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <button className={`w-4 h-4 mt-0.5 border flex items-center justify-center shrink-0 ${task.done ? 'bg-[#111] border-[#111]' : 'border-[#D5D2C8] bg-white'}`}>
                      {task.done && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    </button>
                    <div>
                      <p className={`text-sm font-bold ${task.done ? 'text-[#111]' : 'text-[#111]'}`}>{task.title}</p>
                      <p className={`text-xs mt-1 leading-relaxed ${task.done ? 'text-[#111]/50' : 'text-[#111]/50'}`}>{task.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 border border-[#EAE8E2] text-xs font-bold uppercase tracking-wider text-[#111] hover:bg-[#F9F8F6] transition-colors flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Edit Curriculum
              </button>
            </div>

            {/* Teacher's Private Notes */}
            <div className="bg-[#FDFBF7] border border-[#EAE8E2] p-8 flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-serif font-bold text-[#111]">Teacher&apos;s Private Notes</h3>
                <span className="text-[10px] italic text-[#111]/40">Last updated: Feb 25</span>
              </div>
              <textarea 
                className="w-full flex-1 bg-white border border-[#EAE8E2] p-4 text-sm text-[#111] resize-none focus:outline-none focus:border-[#8A6D3B] placeholder:text-[#111]/30 italic mb-6"
                placeholder="Enter session feedback or student observations here..."
              ></textarea>
              <div className="flex justify-between items-center">
                <button className="text-xs text-[#111]/40 hover:text-[#111]">Discard</button>
                <button className="bg-[#111] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#222] transition-colors">
                  Save & Notify Student
                </button>
              </div>
            </div>
          </div>

          {/* Summer Recital Audition Card */}
          <div className="bg-[#111] text-white flex flex-col md:flex-row items-stretch">
            <div className="p-12 md:w-1/2 flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A6D3B] mb-4">Next Milestone</p>
              <h3 className="text-4xl font-serif font-bold leading-tight mb-6">Summer Recital Audition</h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                Mateo has been selected to perform the Chopin Etude for the academy&apos;s prestigious Summer Recital. Focus on emotional narrative in the middle section.
              </p>
              <button className="bg-[#8A6D3B] text-white px-8 py-4 text-xs font-bold uppercase tracking-wider hover:bg-[#7A5D2B] transition-colors self-start">
                View Audition Requirements
              </button>
            </div>
            <div className="md:w-1/2 min-h-[300px] relative">
              <img src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=800" alt="Piano hands" className="absolute inset-0 w-full h-full object-cover grayscale opacity-70" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
