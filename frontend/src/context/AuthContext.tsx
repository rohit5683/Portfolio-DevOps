import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';


interface AuthContextType {
  user: any;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setUser({ email: 'rohit@example.com' }); // Placeholder
    }
    setIsLoading(false);
  }, []);

  // Inactivity Tracker
  useEffect(() => {
    if (!user) return;

    let lastActivity = Date.now();
    const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const checkInactivity = () => {
      if (Date.now() - lastActivity > INACTIVITY_LIMIT) {
        logout();
      }
    };

    // Events to track activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, updateActivity));

    // Check every minute
    const interval = setInterval(checkInactivity, 60 * 1000);

    return () => {
      events.forEach(event => window.removeEventListener(event, updateActivity));
      clearInterval(interval);
    };
  }, [user, logout]);

  const login = (token: string, refreshToken: string) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    setUser({ email: 'rohit@example.com' }); // Placeholder
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
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
