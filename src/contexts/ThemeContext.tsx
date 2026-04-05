import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext<any>(null);

const ACCENT_PRESETS = ['blue', 'indigo', 'violet', 'emerald', 'rose', 'amber'];

function getInitialTheme() {
  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

function getInitialAccent() {
  try {
    const stored = localStorage.getItem('accent-color');
    if (ACCENT_PRESETS.includes(stored)) return stored;
  } catch {}
  return 'blue';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [accentColor, setAccentColorState] = useState(getInitialAccent);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentColor);
    try { localStorage.setItem('accent-color', accentColor); } catch {}
  }, [accentColor]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const setAccentColor = useCallback((color) => {
    if (ACCENT_PRESETS.includes(color)) {
      setAccentColorState(color);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
