'use client';

import { Bell, PanelLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { UserNav } from '../user-nav';
import { ThemeToggle } from '../theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const notifications = [
    { title: "New lead assigned", description: "John Doe from marketing campaign.", time: "5 min ago", avatar: "JD" },
    { title: "Task due soon", description: "Follow up with Jane Smith.", time: "30 min ago", avatar: "JS" },
    { title: "System update", description: "Version 2.1 is now live.", time: "1 hour ago", avatar: "SU" },
    { title: "Meeting reminder", description: "Project kick-off at 3 PM.", time: "2 hours ago", avatar: "PM" },
]

function getTitleFromPathname(pathname: string) {
    if (pathname === '/admin') return 'Admin Dashboard';
    if (pathname === '/superadmin') return 'Super Admin Dashboard';
    if (pathname === '/team-leader') return 'Team Leader Dashboard';
    if (pathname === '/staff') return 'Staff Dashboard';
  
    const parts = pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
  
    // Check if it's a UUID or a number-like string and ignore it
    if (lastPart && /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(lastPart) || /^\d+$/.test(lastPart)) {
        const secondLastPart = parts[parts.length - 2];
        if (secondLastPart) {
             return secondLastPart
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
        }
    }

    if (!lastPart) {
      if (pathname.includes('/admin')) return 'Admin Dashboard';
      if (pathname.includes('/superadmin')) return 'Super Admin Dashboard';
      if (pathname.includes('/team-leader')) return 'Team Leader Dashboard';
      if (pathname.includes('/staff')) return 'Staff Dashboard';
      return 'Dashboard';
    }
  
    return lastPart
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  

export function Header({ setSidebarOpen }: { setSidebarOpen?: (open: boolean) => void }) {
  const pathname = usePathname();
  
  const headerTitle = useMemo(() => getTitleFromPathname(pathname), [pathname]);

  return (
    <header className={cn(
        "sticky top-0 z-30 flex h-20 shrink-0 items-center justify-between gap-4 border-b bg-card px-4 shadow-sm md:px-6"
    )}>
      <div className="flex items-center gap-4">
        {setSidebarOpen && <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 lg:hidden text-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={() => setSidebarOpen(true)}
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>}
        <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-semibold">{headerTitle}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4 ml-auto">
        <ThemeToggle />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-3 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_2px_hsl(var(--primary))]"></span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification, index) => (
                    <DropdownMenuItem key={index} className="flex items-start gap-3 p-2">
                         <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback>{notification.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                    </DropdownMenuItem>
                ))}
                </div>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem className="justify-center text-sm text-primary hover:!bg-accent hover:!text-primary">
                    View all notifications
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <UserNav />
      </div>
    </header>
  );
}
    