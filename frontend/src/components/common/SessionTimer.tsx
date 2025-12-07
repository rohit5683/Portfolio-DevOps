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
    <div className={`flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md shadow-lg transition-all duration-300 ${
      showWarning 
        ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-red-500/20 animate-pulse' 
        : 'bg-black/40 border-white/10 text-blue-400 shadow-blue-500/10 hover:border-blue-500/30 hover:shadow-blue-500/20'
    }`}>
      <div className={`w-2 h-2 rounded-full ${showWarning ? 'bg-red-500' : 'bg-blue-500 animate-pulse'}`}></div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Session</span>
        <span className="font-mono text-sm font-bold tracking-widest">
          {formatTime(remainingTime)}
        </span>
      </div>
    </div>
  );
};

export default SessionTimer;
