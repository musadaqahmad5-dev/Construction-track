import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

export type ThemeVariant = "warm-sand" | "crisp-pearl" | "soft-linen";

export interface ThemeContextType {
  theme: ThemeVariant;
  changeTheme: (newTheme: ThemeVariant, userId?: string) => Promise<void>;
  loadUserTheme: (userId: string) => Promise<void>;
}

export const isThemeVariant = (value: unknown): value is ThemeVariant =>
  value === "warm-sand" ||
  value === "crisp-pearl" ||
  value === "soft-linen";

const DEFAULT_THEME: ThemeVariant = "crisp-pearl";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeVariant>(DEFAULT_THEME);
  const themeRef = useRef<ThemeVariant>(DEFAULT_THEME);
  themeRef.current = theme;

  // Apply data-theme attribute on document.documentElement without overwriting HTML classes
  const applyThemeToDOM = useCallback((targetTheme: ThemeVariant) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute("data-theme", targetTheme);
    }
  }, []);

  // Initial application on mount
  useEffect(() => {
    applyThemeToDOM(DEFAULT_THEME);
  }, [applyThemeToDOM]);

  const loadUserTheme = useCallback(async (userId: string): Promise<void> => {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      setTheme(DEFAULT_THEME);
      applyThemeToDOM(DEFAULT_THEME);
      return;
    }

    if (!db) {
      setTheme(DEFAULT_THEME);
      applyThemeToDOM(DEFAULT_THEME);
      return;
    }

    try {
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const preferredTheme: unknown = userSnap.data()?.preferredTheme;
        if (isThemeVariant(preferredTheme)) {
          setTheme(preferredTheme);
          applyThemeToDOM(preferredTheme);
          return;
        }
      }

      // Fallback if doc doesn't exist, preferredTheme missing or unsupported
      setTheme(DEFAULT_THEME);
      applyThemeToDOM(DEFAULT_THEME);
    } catch (err) {
      console.warn("[ThemeContext] Non-fatal error loading user preferredTheme from Firestore:", err);
      setTheme(DEFAULT_THEME);
      applyThemeToDOM(DEFAULT_THEME);
    }
  }, [applyThemeToDOM]);

  const changeTheme = useCallback(async (newTheme: ThemeVariant, userId?: string): Promise<void> => {
    if (!isThemeVariant(newTheme)) {
      return;
    }

    const previousTheme = themeRef.current;
    setTheme(newTheme);
    applyThemeToDOM(newTheme);

    // If no userId or no change in theme, avoid unnecessary Firestore writes
    if (!userId || !userId.trim() || !db) {
      return;
    }

    if (previousTheme === newTheme) {
      return;
    }

    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, { preferredTheme: newTheme });
    } catch (err) {
      console.warn("[ThemeContext] Non-fatal error persisting user preferredTheme to Firestore:", err);
    }
  }, [applyThemeToDOM]);

  // Integrated auth-boot listener: auto-load theme when authenticated user ID becomes available
  const { user } = useAuth();
  const lastLoadedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUid = user?.uid;
    if (currentUid && currentUid !== lastLoadedUserIdRef.current) {
      lastLoadedUserIdRef.current = currentUid;
      void loadUserTheme(currentUid);
    } else if (!currentUid) {
      lastLoadedUserIdRef.current = null;
    }
  }, [user?.uid, loadUserTheme]);

  const contextValue: ThemeContextType = {
    theme,
    changeTheme,
    loadUserTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
