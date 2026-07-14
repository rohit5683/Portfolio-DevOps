"use client";
import React, { useState, useRef } from "react";
import Navbar from "@/components/layout/Navbar";
import AnimatedBackground from "@/components/layout/AnimatedBackground";
import Terminal from "@/components/common/Terminal";

import EmergencyModal from "@/components/common/EmergencyModal";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isTerminalOpen, setTerminalOpen] = useState(false);
  const [isEmergencyOpen, setEmergencyOpen] = useState(false);

  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  const handleSecretTap = () => {
    const now = Date.now();
    if (now - lastTapRef.current < 500) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapRef.current = now;

    if (tapCountRef.current >= 3) {
      setEmergencyOpen(true);
      tapCountRef.current = 0;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-32 px-6 pb-12 relative z-10">
        {children}
      </main>

      <button
        onClick={() => setTerminalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 p-4 bg-blue-500/10 backdrop-blur-xl hover:bg-blue-500/20 text-blue-400 rounded-full font-mono text-xl transition-all border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-110 flex items-center justify-center cursor-pointer group"
        title="Open Terminal"
      >
        <svg className="w-6 h-6 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Hidden Emergency Trigger */}
      <button
        onClick={handleSecretTap}
        className="fixed bottom-0 left-0 w-16 h-16 z-50 opacity-0 cursor-default"
        title=" "
        aria-hidden="true"
        tabIndex={-1}
      />

      {isTerminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
      {isEmergencyOpen && <EmergencyModal onClose={() => setEmergencyOpen(false)} />}
    </div>
  );
}
