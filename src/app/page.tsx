'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This is the home page. It redirects to the login page.
 */
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  // Return a loading state or null while redirecting
  return (
    <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
    </div>
  );
}
