import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Settings() {
  const session = await auth();

  if (!session?.user) {
    return redirect('/');
  } else {
    redirect('/dashboard/settings/profile');
  }
}
