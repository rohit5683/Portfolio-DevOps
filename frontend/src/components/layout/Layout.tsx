import Navbar from "./Navbar";
import AnimatedBackground from "./AnimatedBackground";
import { Outlet } from "react-router-dom";
import Terminal from "../common/Terminal";
import { useState } from "react";

const Layout = () => {
  const [isTerminalOpen, setTerminalOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      <main className="pt-32 px-6 pb-12 relative z-10">
        <Outlet />
      </main>

      {/* Floating Terminal Button */}
      <button
        onClick={() => setTerminalOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 p-4 bg-blue-500/10 backdrop-blur-xl hover:bg-blue-500/20 text-blue-400 rounded-full font-mono text-xl transition-all border border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-110 flex items-center justify-center cursor-pointer group"
        title="Open Terminal"
      >
        <svg
          className="w-6 h-6 group-hover:animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Global Terminal Overlay */}
      {isTerminalOpen && <Terminal onClose={() => setTerminalOpen(false)} />}
    </div>
  );
};

export default Layout;
