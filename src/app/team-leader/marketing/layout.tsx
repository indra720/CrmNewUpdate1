
'use client';

import { MarketingDialog } from "@/components/marketing/dialog";
import { MarketingProvider } from "@/components/marketing/provider";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useMarketingDialog } from "@/components/marketing/provider";

function MarketingFlow() {
  const { openDialog } = useMarketingDialog();
  const pathname = usePathname();

  useEffect(() => {
    const pathParts = pathname.split('/');
    const platform = pathParts[pathParts.length - 1];

    if (platform) {
        const platformTitle = platform.charAt(0).toUpperCase() + platform.slice(1);
        openDialog(platformTitle);
    }
  }, [pathname, openDialog]);

  return <MarketingDialog />;
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketingProvider>
        {children}
        <MarketingFlow />
    </MarketingProvider>
  );
}
