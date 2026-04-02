"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Cpu, Cloud, ShieldCheck, Database, Globe } from "lucide-react";

const DEVOPS_LOGS = [
  "INITIALIZING TERRAFORM V1.5.0...",
  "CONNECTING TO AWS (US-EAST-1)...",
  "PROVISIONING VPC & SUBNETS...",
  "CONFIGURING KUBERNETES CLUSTER (EKS)...",
  "STARTING DOCKER CONTAINERS...",
  "SETTING UP CI/CD PIPELINES (JENKINS)...",
  "HARDENING SECURITY GROUPS (WAF)...",
  "ESTABLISHING DATABASE CONNECTION...",
  "SYNCING REPOSITORIES (GIT)...",
  "INFRASTRUCTURE IS READY."
];

const SplashScreen = ({ onFinish }: { onFinish?: () => void }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < DEVOPS_LOGS.length) {
        setLogs((prev) => [...prev, DEVOPS_LOGS[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 1500);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [onFinish]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center overflow-hidden font-mono"
    >
      {/* Interactive Mesh Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.4) 0%, transparent 60%)`,
        }}
      />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />

      {/* Main Terminal Box */}
      <div className="relative w-full max-w-[95%] md:max-w-2xl px-4 md:px-0">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-morphism rounded-xl border border-blue-500/30 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)]"
        >
          {/* Terminal Title Bar */}
          <div className="bg-blue-500/10 border-b border-blue-500/30 px-3 md:px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 text-center text-[8px] md:text-[10px] text-blue-400/70 tracking-widest uppercase">
              Environment Initializer
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-4 md:p-6 min-h-[250px] md:min-h-[300px] bg-black/40 backdrop-blur-xl">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              >
                <Cpu className="text-blue-400 w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
              <div>
                <h1 className="text-blue-100 text-base md:text-lg font-bold tracking-tight uppercase">ROHIT VISHWAKARMA</h1>
                <p className="text-blue-400/70 text-[8px] md:text-xs tracking-widest uppercase">DevOps & Cloud Infrastructure</p>
              </div>
            </div>

            <div className="space-y-1 md:space-y-1.5 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-start gap-2 md:gap-3 text-[9px] md:text-xs"
                  >
                    <span className="text-blue-500/50 select-none hidden xs:inline">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                    <span className={`tracking-wide ${i === logs.length - 1 ? 'text-blue-400' : 'text-gray-500'} break-all md:break-normal`}>
                      {i === logs.length - 1 && <span className="inline-block w-1.5 h-2.5 md:w-2 md:h-3 bg-blue-400 mr-2 animate-pulse" />}
                      {log}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Tech Icons Floating - Responsive visibility */}
        <div className="absolute -top-8 -left-8 md:-top-12 md:-left-12 text-blue-500/10 animate-bounce delay-100"><Cloud size={32} className="md:w-12 md:h-12" /></div>
        <div className="absolute -bottom-8 -right-8 md:-bottom-12 md:-right-12 text-blue-500/10 animate-bounce delay-500"><ShieldCheck size={32} className="md:w-12 md:h-12" /></div>
        <div className="absolute top-1/2 -right-10 md:-right-16 text-blue-500/10 animate-pulse hidden sm:block"><Database size={32} className="md:w-10 md:h-10" /></div>
        <div className="absolute top-1/2 -left-10 md:-left-16 text-blue-500/10 animate-pulse delay-700 hidden sm:block"><Globe size={32} className="md:w-10 md:h-10" /></div>
      </div>

      <div className="mt-12 flex items-center gap-2">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-blue-500/50" />
        <span className="text-[10px] text-blue-500/50 tracking-[0.3em] uppercase">Booting Architecture</span>
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-blue-500/50" />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
