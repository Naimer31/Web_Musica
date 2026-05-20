"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  LayoutDashboard, Users, BookOpen, BarChart3, Settings, HelpCircle,
  Search, Bell, Filter, ArrowUpRight
} from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type Profile = {
  full_name: string | null;
  role: string;
};

export default function AdminAnalytics() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData as Profile);
    };
    load();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || "Admin";
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
              <p className="text-[9px] uppercase tracking-widest text-[#8A6D3B] mt-0.5">Academic Portal</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: "Dashboard", active: false },
            { icon: Users, label: "Students", active: false },
            { icon: BookOpen, label: "Curriculum", active: false },
            { icon: BarChart3, label: "Analytics", active: true },
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
              placeholder="Search analytics..." 
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
            <button onClick={handleLogout} className="w-8 h-8 rounded-full bg-[#EAE8E2] overflow-hidden border border-[#D5D2C8] flex items-center justify-center font-serif text-sm">
              {avatarLetter}
            </button>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto space-y-8">
          
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A6D3B] mb-2">Performance Overview</p>
              <h2 className="text-4xl font-serif font-bold text-[#111] tracking-tight">Academic Analytics</h2>
            </div>
            
            <div className="flex items-end gap-4">
              <div>
                <label className="block text-[10px] font-medium text-[#111]/50 mb-1">Department</label>
                <select className="bg-white border border-[#EAE8E2] text-sm px-4 py-2 outline-none focus:border-[#8A6D3B] min-w-[160px]">
                  <option>All Departments</option>
                  <option>Strings</option>
                  <option>Keyboard</option>
                  <option>Woodwind</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-medium text-[#111]/50 mb-1">Date Range</label>
                <select className="bg-white border border-[#EAE8E2] text-sm px-4 py-2 outline-none focus:border-[#8A6D3B] min-w-[160px]">
                  <option>Last Quarter</option>
                  <option>This Year</option>
                  <option>All Time</option>
                </select>
              </div>
              <button className="bg-[#111] text-white p-2 hover:bg-[#222] transition-colors h-[38px] w-[38px] flex items-center justify-center">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Students", value: "1,248", desc: "12% Increase from last term", positive: true },
              { title: "Avg Proficiency", value: "Level 6.4", desc: "Stable performance levels", positive: false },
              { title: "Rehearsal Hours", value: "24,502", desc: "8% Higher engagement", positive: true },
              { title: "Recital Score", value: "94/100", desc: "Top 5% Global Ranking", positive: true, isStar: true },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-[#EAE8E2] p-6 flex flex-col justify-center h-32">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#111]/50 mb-3">{stat.title}</p>
                <p className="text-3xl font-serif font-bold text-[#111] mb-2">{stat.value}</p>
                <div className={`flex items-center gap-1.5 text-[10px] font-medium ${stat.positive ? 'text-[#2e7d32]' : 'text-[#8A6D3B]'}`}>
                  {stat.isStar ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ) : stat.positive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <span className="w-3 h-0.5 bg-current inline-block"></span>
                  )}
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart (Engagement Trends) */}
            <div className="lg:col-span-2 bg-white border border-[#EAE8E2] p-8 flex flex-col">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-xl font-serif font-bold text-[#111] mb-1">Engagement Trends</h3>
                  <p className="text-sm text-[#111]/50">Active practice and theory module completion</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#111]"></span> Practice
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-[#8A6D3B]"></span> Theory
                  </div>
                </div>
              </div>
              
              {/* CSS Only Line Chart Mockup */}
              <div className="relative flex-1 mt-auto h-48 border-b border-[#EAE8E2] flex items-end">
                <div className="absolute inset-0 border-b border-dashed border-[#EAE8E2] top-1/2"></div>
                {/* Curve 1 (Black) */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,80 Q25,90 50,60 T100,50" fill="none" stroke="#111" strokeWidth="2" />
                </svg>
                {/* Curve 2 (Gold) */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,90 Q30,95 60,80 T100,65" fill="none" stroke="#8A6D3B" strokeWidth="2" />
                </svg>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-[#111]/40 mt-4">
                <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span>
              </div>
            </div>

            {/* Radar Chart (Skill Distribution) */}
            <div className="bg-white border border-[#EAE8E2] p-8">
              <h3 className="text-xl font-serif font-bold text-[#111] mb-1">Skill Distribution</h3>
              <p className="text-sm text-[#111]/50 mb-8">Average across all cohorts</p>
              
              <div className="relative aspect-square max-w-[220px] mx-auto flex items-center justify-center">
                {/* CSS Only Radar Mockup */}
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                  <polygon points="50,10 90,35 75,85 25,85 10,35" fill="none" stroke="#EAE8E2" strokeWidth="1"/>
                  <polygon points="50,20 80,40 68,75 32,75 20,40" fill="none" stroke="#EAE8E2" strokeWidth="1" strokeDasharray="2 2"/>
                  <polygon points="50,30 70,45 61,65 39,65 30,45" fill="none" stroke="#EAE8E2" strokeWidth="1" strokeDasharray="2 2"/>
                  <line x1="50" y1="50" x2="50" y2="10" stroke="#EAE8E2" strokeWidth="1"/>
                  <line x1="50" y1="50" x2="90" y2="35" stroke="#EAE8E2" strokeWidth="1"/>
                  <line x1="50" y1="50" x2="75" y2="85" stroke="#EAE8E2" strokeWidth="1"/>
                  <line x1="50" y1="50" x2="25" y2="85" stroke="#EAE8E2" strokeWidth="1"/>
                  <line x1="50" y1="50" x2="10" y2="35" stroke="#EAE8E2" strokeWidth="1"/>
                  
                  {/* Data Polygon */}
                  <polygon points="50,15 75,45 70,80 30,70 20,45" fill="#8A6D3B" fillOpacity="0.2" stroke="#8A6D3B" strokeWidth="2"/>
                  
                  {/* Labels */}
                  <text x="50" y="-2" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#111" className="uppercase tracking-widest">Technique</text>
                  <text x="100" y="38" textAnchor="start" fontSize="5" fontWeight="bold" fill="#111" className="uppercase tracking-widest" transform="rotate(90 95 38)">Theory</text>
                  <text x="75" y="94" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#111" className="uppercase tracking-widest">History</text>
                  <text x="25" y="94" textAnchor="middle" fontSize="5" fontWeight="bold" fill="#111" className="uppercase tracking-widest">Ear</text>
                  <text x="0" y="38" textAnchor="end" fontSize="5" fontWeight="bold" fill="#111" className="uppercase tracking-widest" transform="rotate(-90 5 38)">Sight</text>
                </svg>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Instrument Proficiency */}
            <div className="bg-white border border-[#EAE8E2] p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-serif font-bold text-[#111]">Instrument Proficiency</h3>
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#111]/40 flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Level 1-10 Scale
                </span>
              </div>
              
              <div className="space-y-6">
                {[
                  { name: "Piano", value: 8.2, pct: "82%" },
                  { name: "Violin", value: 7.5, pct: "75%" },
                  { name: "Cello", value: 6.8, pct: "68%" },
                  { name: "Flute", value: 7.1, pct: "71%" },
                  { name: "Composition", value: 5.9, pct: "59%" },
                ].map((inst, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs font-bold mb-2 text-[#111]">
                      <span>{inst.name}</span>
                      <span>{inst.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#EAE8E2] flex">
                      <div className="h-full bg-[#111]" style={{ width: inst.pct }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Departmental Status */}
            <div className="bg-white border border-[#EAE8E2] p-0 relative">
              {/* Floating Gold Icon */}
              <div className="absolute -top-3 -right-3 w-12 h-12 bg-[#E1C27B] shadow-lg flex items-center justify-center text-[#111] rounded-sm">
                <BarChart3 className="w-5 h-5" />
              </div>
              
              <div className="p-8 pb-6 border-b border-[#EAE8E2]">
                <h3 className="text-xl font-serif font-bold text-[#111] mb-1">Departmental Status</h3>
                <p className="text-sm text-[#111]/50">Operational efficiency & student output</p>
              </div>
              
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#EAE8E2] bg-[#F9F8F6]">
                    <th className="py-3 px-8 text-[9px] font-bold uppercase tracking-widest text-[#111]/50">Dept</th>
                    <th className="py-3 px-4 text-[9px] font-bold uppercase tracking-widest text-[#111]/50">Students</th>
                    <th className="py-3 px-8 text-[9px] font-bold uppercase tracking-widest text-[#111]/50">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE8E2]">
                  {[
                    { dept: "Strings", students: 412, rating: 2 },
                    { dept: "Keyboard", students: 385, rating: 2 },
                    { dept: "Woodwind", students: 218, rating: 2 },
                    { dept: "Vocal", students: 156, rating: 2 },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="py-4 px-8 font-semibold text-[#111]">{row.dept}</td>
                      <td className="py-4 px-4 text-[#111]/70">{row.students}</td>
                      <td className="py-4 px-8 flex gap-0.5">
                        <StarIcon filled />
                        <StarIcon filled={row.rating > 1} />
                        <StarIcon filled={row.rating > 2} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-4 text-center bg-[#F9F8F6]">
                <button className="text-[10px] font-bold uppercase tracking-widest text-[#111] hover:text-[#8A6D3B] transition-colors">
                  Download Report (.PDF)
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Insight Card */}
          <div className="bg-[#111] text-white p-12 relative overflow-hidden flex items-center">
            {/* Background image overlay */}
            <div className="absolute inset-0 opacity-40 mix-blend-luminosity">
              <img src="https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=1200" alt="Piano" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#111] via-[#111]/80 to-transparent"></div>
            
            <div className="relative z-10 max-w-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8A6D3B] mb-4">Academy Insight</p>
              <h3 className="text-3xl font-serif font-bold leading-tight mb-8">
                The correlation between early theory mastery and professional orchestral placement.
              </h3>
              <button className="text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-[#8A6D3B] transition-colors">
                Read White Paper <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? "#8A6D3B" : "none"} stroke={filled ? "#8A6D3B" : "#EAE8E2"} strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
