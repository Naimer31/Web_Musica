"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import * as Tone from "tone";
import { ArrowLeft, Play, Square, Settings2, Mic, Activity } from "lucide-react";

export default function StudioPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [isToneStarted, setIsToneStarted] = useState(false);
  
  // Referencias para los sintes de Tone.js
  const clickHigh = useRef<Tone.MembraneSynth | null>(null);
  const clickLow = useRef<Tone.MembraneSynth | null>(null);
  const loop = useRef<Tone.Loop | null>(null);

  // Inicializar Tone.js
  useEffect(() => {
    clickHigh.current = new Tone.MembraneSynth({ pitchDecay: 0.008, envelope: { attack: 0.001, decay: 0.1, sustain: 0 } }).toDestination();
    clickLow.current = new Tone.MembraneSynth({ pitchDecay: 0.008, envelope: { attack: 0.001, decay: 0.1, sustain: 0 } }).toDestination();

    let beatCount = 0;
    loop.current = new Tone.Loop((time) => {
      if (beatCount % 4 === 0) {
        clickHigh.current?.triggerAttackRelease("C5", "8n", time);
      } else {
        clickLow.current?.triggerAttackRelease("G4", "8n", time);
      }
      beatCount++;
    }, "4n");

    return () => {
      loop.current?.dispose();
      clickHigh.current?.dispose();
      clickLow.current?.dispose();
    };
  }, []);

  // Actualizar BPM en Tone.js
  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const toggleMetronome = async () => {
    if (!isToneStarted) {
      await Tone.start();
      setIsToneStarted(true);
    }

    if (isPlaying) {
      Tone.Transport.stop();
      loop.current?.stop();
    } else {
      Tone.Transport.start();
      loop.current?.start(0);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/20 blur-[150px] rounded-full pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between mb-12">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Volver al Dashboard</span>
        </Link>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Activity className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium">Estudio Virtual Activo</span>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Metrónomo */}
        <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          
          <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-6 border border-violet-500/30">
            <Settings2 className="w-8 h-8 text-violet-400" />
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Metrónomo Pro</h2>
          <p className="text-white/50 mb-8">Precisión absoluta impulsada por Tone.js</p>

          <div className="text-7xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            {bpm} <span className="text-2xl text-white/30 font-medium">BPM</span>
          </div>

          <input 
            type="range" 
            min="40" 
            max="220" 
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full max-w-xs h-2 bg-white/10 rounded-lg appearance-none cursor-pointer mb-12 accent-violet-500"
          />

          <button 
            onClick={toggleMetronome}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isPlaying 
                ? "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]" 
                : "bg-violet-600 text-white hover:bg-violet-500 hover:scale-105 shadow-[0_0_40px_rgba(124,58,237,0.4)]"
            }`}
          >
            {isPlaying ? <Square className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
          </button>
        </div>

        {/* Afinador (Visual UI por ahora) */}
        <div className="p-8 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30">
            <Mic className="w-8 h-8 text-indigo-400" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Afinador Cromático</h2>
          <p className="text-white/50 mb-12">Detección de espectro en tiempo real</p>

          <div className="relative w-full h-48 flex items-center justify-center">
            {/* Medidor visual */}
            <div className="absolute w-full flex justify-between px-8 text-white/20 font-bold">
              <span>-50</span>
              <span className="text-indigo-400/50">0</span>
              <span>+50</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-indigo-500 z-10" />
              {/* Aquí irá la lógica de movimiento de la aguja con audio real */}
            </div>
            
            <div className="absolute top-1/2 -translate-y-1/2 text-8xl font-black text-white/10 blur-[2px]">
              E
            </div>
          </div>

          <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center gap-2">
            <Mic className="w-4 h-4" /> Activar Micrófono
          </button>
        </div>

      </main>
    </div>
  );
}
