import type { ReactNode } from "react";


export default function PendingFollowupsReportsLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Koi 'use client' yahan nahi lagega
  // Koi hooks nahi, koi browser-only cheez nahi
  return <>{children}</>;
}
