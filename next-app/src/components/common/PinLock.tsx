"use client";
import React, { useState, useEffect } from "react";

interface PinLockProps {
  onUnlock: (contacts: any[]) => void;
}

export default function PinLock({ onUnlock }: PinLockProps) {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePress = async (num: string) => {
    if (error || pin.length >= 4 || loading) return;
    
    const newPin = pin + num;
    setPin(newPin);

    if (newPin.length === 4) {
      setLoading(true);
      try {
        const response = await fetch("/api/emergency-contacts/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin: newPin }),
        });
        
        if (response.ok) {
          const contacts = await response.json();
          onUnlock(contacts);
        } else {
          throw new Error("Invalid PIN");
        }
      } catch (err) {
        setError(true);
        setTimeout(() => {
          setPin("");
          setError(false);
        }, 800);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackspace = () => {
    if (error || pin.length === 0) return;
    setPin((prev) => prev.slice(0, -1));
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handlePress(e.key);
      } else if (e.key === "Backspace") {
        handleBackspace();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, error]);

  const keypad = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "backspace"]
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-xs mx-auto relative z-10">
      {/* Dynamic Glow Background */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 blur-[60px] opacity-30 transition-colors duration-500 rounded-full ${
        error ? 'bg-red-500' : 'bg-blue-500'
      }`} />

      <div className="text-white text-xs md:text-sm font-bold tracking-[0.2em] text-center h-8 uppercase relative z-10">
        {error ? (
          <span className="text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]">INCORRECT PIN</span>
        ) : (
          <span className="text-gray-300">ENTER SECURE PIN</span>
        )}
      </div>

      {/* PIN Dots */}
      <div className={`flex gap-6 mb-6 ${error ? 'animate-shake' : ''} relative z-10`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={i}
            className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full transition-all duration-300 ring-2 ring-offset-2 ring-offset-transparent ${
              i < pin.length 
                ? error 
                  ? 'bg-red-500 ring-red-500/50 scale-125 shadow-[0_0_20px_rgba(239,68,68,0.8)]' 
                  : 'bg-white ring-blue-400/50 scale-125 shadow-[0_0_20px_rgba(255,255,255,0.8)]'
                : 'bg-white/5 ring-white/10'
            }`}
          />
        ))}
      </div>
      
      {/* Keypad */}
      <div className={`grid grid-cols-3 gap-x-6 gap-y-4 md:gap-x-8 md:gap-y-6 w-full relative z-10 ${error ? 'opacity-50 pointer-events-none' : ''}`}>
        {keypad.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {row.map((btn, colIndex) => {
              if (btn === "") return <div key={`empty-${colIndex}`} />;
              
              if (btn === "backspace") {
                return (
                  <button
                    key="backspace"
                    onClick={handleBackspace}
                    className="w-[72px] h-[72px] md:w-20 md:h-20 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 active:scale-95 border border-white/10 hover:border-blue-500/30 transition-all text-gray-400 hover:text-white group mx-auto"
                  >
                    <svg className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                    </svg>
                  </button>
                );
              }

              return (
                <button
                  key={btn}
                  onClick={() => handlePress(btn)}
                  className="relative group w-[72px] h-[72px] md:w-20 md:h-20 flex items-center justify-center rounded-full overflow-hidden transition-all active:scale-90 mx-auto"
                >
                  {/* Glassmorphism Background */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 group-hover:bg-white/10 group-hover:border-blue-500/30 transition-colors rounded-full" />
                  
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                  
                  {/* Text */}
                  <span className="relative z-10 text-white text-3xl md:text-4xl font-light font-sans group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b group-hover:from-white group-hover:to-gray-400 transition-all">
                    {btn}
                  </span>
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
