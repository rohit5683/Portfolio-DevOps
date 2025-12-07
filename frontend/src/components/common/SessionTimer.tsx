import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const SessionTimer = () => {
  const { remainingTime, isAuthenticated } = useAuth();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (remainingTime !== null && remainingTime < 300) { // Less than 5 minutes
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [remainingTime]);

  if (!isAuthenticated || remainingTime === null) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 rounded-full backdrop-blur-md shadow-lg transition-all duration-300 ${
      showWarning 
        ? 'bg-red-500/10 shadow-red-500/20 animate-pulse' 
        : 'bg-black/40 shadow-blue-500/10 hover:shadow-blue-500/20'
    }`}>
      <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${showWarning ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`}></div>
      <div className="flex flex-col leading-none">
        <span className="text-[8px] md:text-[10px] text-gray-400 font-medium uppercase tracking-wider">Session</span>
        <span className="font-mono text-xs md:text-sm font-bold tracking-widest">
          {formatTime(remainingTime)}
        </span>
      </div>
    </div>
  );
};

export default SessionTimer;
