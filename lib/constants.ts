import { NavItem } from '@/types';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const MIN_PASSWORD_LENGTH = 8;

export const SYSTEM_PROMPT = `Sender is Sang Dang, founder of Sieutoc Solutions. Email: sang@sieutoc.app.
  Create a professional email from a company representative reporting a potential false-positive website blocking issue. 
  Include: sender name, company name, website URL, polite explanation of the technical problem, request for assistance, cooperative tone. 
  Max 5 sentences long.`;

export const Keys = {
  CHECK_VIRUSTOTAL_TASK: 'check-virustotal-task',
} as const;

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['g', 'g'],
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Projects',
    url: '/dashboard/projects',
    icon: 'project',
    shortcut: ['g', 'p'],
    isActive: false,
    items: [], // No child items
  },
  {
    title: 'Vendors',
    url: '/dashboard/vendors',
    icon: 'vendor',
    shortcut: ['g', 'v'],
    isActive: false,
    isAdminOnly: true,
    items: [], // No child items
  },
  {
    title: 'Settings',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'settings',
    isActive: true,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['g', 'm'],
      },
      {
        title: 'Organization',
        url: '/dashboard/organization',
        icon: 'userPen',
        shortcut: ['g', 'o'],
      },
    ],
  },
];
