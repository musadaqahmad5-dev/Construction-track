/**
 * LOOK VISION v2.4 - Admin Route Guard
 * Enterprise Firebase Custom Claims Authorization Shield
 * 
 * Protects admin views and administrative components by verifying
 * active Firebase custom claims and user role privileges before rendering.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, ArrowLeft, RefreshCw, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { isPreviewEnvironment } from '../../lib/previewEnvironment';

interface AdminRouteGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
  onUnauthorized?: () => void;
  requiredRole?: 'admin' | 'super_admin';
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({
  children,
  fallbackPath = '/',
  onUnauthorized,
  requiredRole = 'admin'
}) => {
  const { user, loading, isAdmin, isSuperAdmin, userRole, refreshClaims } = useAuth();
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [hasHydratedClaims, setHasHydratedClaims] = useState<boolean>(false);
  const isPreview = isPreviewEnvironment();

  // Reset claims hydration state whenever active user changes
  useEffect(() => {
    setHasHydratedClaims(false);
  }, [user?.uid]);

  // Ensure claims are force-refreshed before making final RBAC decision
  useEffect(() => {
    let isMounted = true;

    const verifyClaimsHydration = async () => {
      if (!loading) {
        if (user && !hasHydratedClaims) {
          setIsVerifying(true);
          try {
            await refreshClaims(true);
          } catch (err) {
            console.warn('[AdminRouteGuard] ID token refresh warning during claims hydration:', err);
          } finally {
            if (isMounted) {
              setIsVerifying(false);
              setHasHydratedClaims(true);
            }
          }
        } else {
          setHasHydratedClaims(true);
        }
      }
    };

    verifyClaimsHydration();

    return () => {
      isMounted = false;
    };
  }, [loading, user, hasHydratedClaims, refreshClaims]);

  const handleReverify = async () => {
    setIsVerifying(true);
    await refreshClaims(true);
    setIsVerifying(false);
  };

  const handleReturnToWorkspace = () => {
    try {
      localStorage.removeItem('last_active_place_subtab');
    } catch (e) {}

    if (onUnauthorized) {
      onUnauthorized();
    }

    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', fallbackPath || '/');
      window.dispatchEvent(new CustomEvent('lookvision_route_change'));
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const roleAuthorized = requiredRole === 'super_admin' ? isSuperAdmin : isAdmin;
  const canAccess = isPreview || (Boolean(user) && roleAuthorized);

  if (!isPreview && (loading || isVerifying || !hasHydratedClaims)) {
    return (
      <div className="min-h-screen bg-[#05050a] flex items-center justify-center p-6 text-zinc-100 font-sans">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-mono text-white">Verifying Administrator Claims...</h3>
            <p className="text-xs text-zinc-400 mt-1">Validating cryptographic Firebase ID token custom claims & RBAC authorizations.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    try {
      localStorage.removeItem('last_active_place_subtab');
    } catch (e) {}

    return (
      <div className="min-h-screen bg-[#05050a] flex items-center justify-center p-6 text-zinc-100 font-sans relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-[#07070c] border border-red-500/20 rounded-2xl p-8 shadow-2xl relative z-10 text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono tracking-widest uppercase font-semibold">
              403 Access Forbidden
            </span>
            <h2 className="text-2xl font-bold font-mono text-white tracking-tight">
              Administrator Privileges Required
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto">
              This area is protected by LOOK VISION Enterprise Role Based Access Control (RBAC). Your current identity vector <code className="text-zinc-200 bg-white/5 px-1.5 py-0.5 rounded font-mono">({userRole || 'anonymous'})</code> lacks verified <code className="text-red-300 font-mono">[{requiredRole}]</code> custom claims.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left text-xs font-mono space-y-2 text-zinc-400">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>User ID:</span>
              <span className="text-zinc-200 font-semibold truncate max-w-[200px]">{user?.uid || 'Not Authenticated'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span>Current Role:</span>
              <span className="text-indigo-400 uppercase font-bold">{userRole}</span>
            </div>
            <div className="flex justify-between">
              <span>Required Claim:</span>
              <span className="text-red-400 font-bold uppercase">{requiredRole}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleReturnToWorkspace}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Workspace</span>
            </button>

            <button
              onClick={handleReverify}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Claims</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};
