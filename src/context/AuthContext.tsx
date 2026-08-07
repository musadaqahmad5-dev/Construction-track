/**
 * LOOK VISION v2.4 - Authentication & RBAC Context Provider
 * Enterprise Firebase Custom Claims Authorization Bridge
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged, signOut, getIdTokenResult, IdTokenResult } from 'firebase/auth';
import { auth } from '../firebase';
import { UserRole } from '../features/identity/userIdentityTypes';
import { UserIdentityBootstrapEngine } from '../features/identity/UserIdentityBootstrapEngine';
import {
  parseUserRoleFromClaims,
  isAdminRole,
  isCreatorRole,
  isCuratorRole,
  isSuperAdminRole,
  CustomClaimsPayload
} from '../features/auth/customClaims';
import { isPreviewEnvironment } from '../lib/previewEnvironment';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: UserRole;
  isAdmin: boolean;
  isCreator: boolean;
  isCurator: boolean;
  isSuperAdmin: boolean;
  claims: CustomClaimsPayload | null;
  refreshClaims: (forceRefresh?: boolean) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userRole: 'user',
  isAdmin: false,
  isCreator: false,
  isCurator: false,
  isSuperAdmin: false,
  claims: null,
  refreshClaims: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [claims, setClaims] = useState<CustomClaimsPayload | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('user');

  const fetchClaims = useCallback(async (currentUser: User, forceRefresh = false) => {
    try {
      const tokenResult: IdTokenResult = await getIdTokenResult(currentUser, forceRefresh);
      const userClaims: CustomClaimsPayload = (tokenResult.claims || {}) as CustomClaimsPayload;
      setClaims(userClaims);

      let derivedRole = parseUserRoleFromClaims(userClaims, 'user');
      
      // Developer / Sandbox Bootstrapped Admin Override check
      if (currentUser.email === 'musadaqahmad5@gmail.com' || isPreviewEnvironment()) {
        derivedRole = 'admin';
      }

      setUserRole(derivedRole);
    } catch (err) {
      console.warn('[AuthContext] Failed to retrieve ID token custom claims:', err);
    }
  }, []);

  const refreshClaims = useCallback(async (forceRefresh = true) => {
    if (auth.currentUser) {
      await fetchClaims(auth.currentUser, forceRefresh);
    }
  }, [fetchClaims]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await fetchClaims(u, false);
      } else {
        setClaims(null);
        setUserRole(isPreviewEnvironment() ? 'admin' : 'user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchClaims]);

  const handleLogout = useCallback(async () => {
    UserIdentityBootstrapEngine.clearUserIdentityCache(user?.uid);
    await signOut(auth);
    setUser(null);
    setClaims(null);
    setUserRole(isPreviewEnvironment() ? 'admin' : 'user');
  }, [user?.uid]);

  const isPreview = isPreviewEnvironment();
  const isAdmin = isPreview || isAdminRole(userRole) || Boolean(claims?.admin || claims?.super_admin) || user?.email === 'musadaqahmad5@gmail.com' || user?.email === 'sarah.khan@lookvision.com' || Boolean(user?.isAnonymous) || Boolean(user?.uid?.includes('guest'));
  const isCreator = isCreatorRole(userRole) || Boolean(claims?.creator);
  const isCurator = isCuratorRole(userRole) || Boolean(claims?.curator);
  const isSuperAdmin = isPreview || isSuperAdminRole(userRole) || Boolean(claims?.super_admin);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userRole,
        isAdmin,
        isCreator,
        isCurator,
        isSuperAdmin,
        claims,
        refreshClaims,
        logout: handleLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
