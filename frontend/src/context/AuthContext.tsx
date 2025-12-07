import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  user: any;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  remainingTime: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setRemainingTime(null);
  }, []);

  const checkTokenExpiration = useCallback((token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = decoded.exp - currentTime;
        
        if (timeLeft <= 0) {
          logout();
          return null;
        }
        return timeLeft;
      }
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
    }
    return null;
  }, [logout]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const timeLeft = checkTokenExpiration(token);
      if (timeLeft !== null) {
        setUser({ email: 'rohit@example.com' }); // Placeholder, ideally decode from token or fetch profile
        setRemainingTime(timeLeft);
      }
    }
    setIsLoading(false);
  }, [checkTokenExpiration]);

  useEffect(() => {
    if (!user) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          logout();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, logout]);

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    setUser({ email: 'rohit@example.com' }); // Placeholder
    const timeLeft = checkTokenExpiration(token);
    setRemainingTime(timeLeft);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, remainingTime }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
