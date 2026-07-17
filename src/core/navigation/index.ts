import { NavigationId } from '../enums';
import { ROUTES } from '../constants';

export interface NavigationItemSpec {
  id: string;
  label: string;
  route?: string;
  action?: string;
  badge?: string;
}

export const NAVIGATION_ITEMS: NavigationItemSpec[] = [
  { id: NavigationId.HOME, label: 'Home Hub', route: ROUTES.HOME },
  { id: NavigationId.PROFILE, label: 'My Profile', route: ROUTES.PROFILE },
  { id: NavigationId.AUTHENTICATION, label: 'Sign In', action: 'AUTHENTICATION' },
  { id: NavigationId.AI_MEMORY, label: 'AI Memory', route: ROUTES.DASHBOARD },
  { id: NavigationId.NOTIFICATIONS, label: 'Notifications', action: 'NOTIFICATIONS', badge: '8' },
  { id: NavigationId.SEARCH, label: 'Focus Search', action: 'SEARCH' },
  { id: NavigationId.AI_ASSISTANT, label: 'AI Assistant', action: 'AI_ASSISTANT' },
  { id: NavigationId.SETTINGS, label: 'Settings', route: ROUTES.SYSTEM_ROOM }
];
