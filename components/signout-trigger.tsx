'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

// NOTE: We use this to trigger the signout at client side
export const SignOutTrigger = () => {
  useEffect(() => {
    signOut({ redirect: true, callbackUrl: '/auth' });
  }, []);

  return null;
};
