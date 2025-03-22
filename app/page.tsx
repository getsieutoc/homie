import { getAuth } from '@/auth';
import Link from 'next/link';

export default async function Homepage() {
  const { session } = await getAuth();

  return (
    <div>
      {session ? (
        <Link href="/dashboard">Go to Dashboard</Link>
      ) : (
        <Link href="/auth">Login</Link>
      )}
    </div>
  );
}
