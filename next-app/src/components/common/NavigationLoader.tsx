"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Zap, Layout } from "lucide-react";
import { usePathname } from "next/navigation";

const NavigationLoader = ({ isVisible = true }: { isVisible?: boolean }) => {
  const pathname = usePathname();
  const displayPath = pathname === "/" ? "ROOT" : pathname.toUpperCase().replace("/", "");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] bg-[#020617]/95 backdrop-blur-md flex flex-col items-center justify-center font-mono overflow-hidden"
        >
          {/* Subtle Scanning Mesh */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative flex flex-col items-center space-y-8">
            {/* Animated Node Connection */}
            <div className="flex items-center gap-12 relative">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  borderColor: ["rgba(59,130,246,0.3)", "rgba(59,130,246,0.8)", "rgba(59,130,246,0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-2xl border border-blue-500/30 bg-blue-500/5 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.1)]"
              >
                <Layout className="text-blue-400 w-8 h-8" />
              </motion.div>

              <div className="w-24 h-[1px] bg-blue-500/20 relative overflow-hidden">
                <motion.div
                  animate={{ left: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>

              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  borderColor: ["rgba(168,85,247,0.3)", "rgba(168,85,247,0.8)", "rgba(168,85,247,0.3)"]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="w-16 h-16 rounded-2xl border border-purple-500/30 bg-purple-500/5 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.1)]"
              >
                <Share2 className="text-purple-400 w-8 h-8" />
              </motion.div>

              {/* Central Pulsating Core */}
              <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-4 h-4 bg-blue-400 rounded-full blur-[4px]"
                />
              </div>
            </div>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Zap size={14} className="text-yellow-500 animate-pulse" />
                <span className="text-[10px] text-blue-400/70 tracking-[0.4em] uppercase">Context Switching</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <span className="text-blue-100 text-sm font-bold tracking-widest uppercase">
                  Routing to <span className="text-blue-400">{displayPath}</span>
                </span>
                <div className="flex gap-1.5 mt-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-blue-500/50"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
             <div className="flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[9px] text-gray-500 uppercase tracking-widest">Synchronizing Infrastructure Nodes...</span>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavigationLoader;
