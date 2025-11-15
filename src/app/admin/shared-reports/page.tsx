'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminReportsIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/superadmin/reports/reports-index'); // Redirect to the generic reports index
  }, [router]);

  return null; // Or a loading spinner
}
