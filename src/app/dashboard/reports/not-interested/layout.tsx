import type { ReactNode } from "react";

export default function NotInterestedReportsLayout({
  children,
}: {
  children: ReactNode;
}) {
  // No viewport, no metadata, no hooks → Fully safe layout
  return <>{children}</>;
}
