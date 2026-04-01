"use client";

import React from "react";

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  fullScreen = true, 
  text = "Loading..." 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-700">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
        
        {/* Inner Pulsating Circle */}
        <div className="absolute inset-0 m-auto w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full blur-[2px] animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
        
        {/* Decorative Particles */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-75" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150" />
      </div>
      
      {text && (
        <div className="relative">
          <span className="text-lg font-medium tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse">
            {text}
          </span>
          {/* Subtle underline animation */}
          <div className="absolute -bottom-1 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent scale-x-0 animate-[scale-x_2s_ease-in-out_infinite]" />
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-md">
        <div className="glass-morphism p-12 rounded-3xl border border-white/10 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
};

export default Loading;
