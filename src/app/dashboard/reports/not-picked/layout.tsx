import type { ReactNode } from "react";

export default function NotPickedReportsLayout({
  children,
}: {
  children: ReactNode;
}) {
  // No 'use client', no hooks, no viewport, no metadata
  return <>{children}</>;
}
