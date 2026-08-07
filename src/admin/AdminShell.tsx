/**
 * LOOK VISION v2.4 - Enterprise Admin Shell Component
 * Protected Entry Point for /admin Command Center
 */

import React from 'react';
import { AdminRouteGuard } from '../components/auth/AdminRouteGuard';
import { AdminLayout } from './AdminLayout';
import { AdminTab } from './AdminNavigation';

interface AdminShellProps {
  onExitAdmin?: () => void;
  initialTab?: AdminTab;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  onExitAdmin,
  initialTab = 'overview'
}) => {
  const handleExitAdmin = () => {
    try {
      localStorage.removeItem('last_active_place_subtab');
    } catch (e) {}

    if (onExitAdmin) {
      onExitAdmin();
    } else {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new CustomEvent('lookvision_route_change'));
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }
  };

  return (
    <AdminRouteGuard
      fallbackPath="/"
      requiredRole="admin"
      onUnauthorized={handleExitAdmin}
    >
      <AdminLayout
        initialTab={initialTab}
        onExitAdmin={handleExitAdmin}
      />
    </AdminRouteGuard>
  );
};
