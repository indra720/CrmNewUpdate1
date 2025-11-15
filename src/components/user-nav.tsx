'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserData {
  name: string;
  email: string;
  avatarFallback: string;
  profileLink: string;
}

const roleData: { [key: string]: UserData } = {
  admin: {
    name: 'Admin User',
    email: 'admin@nexus.com',
    avatarFallback: 'A',
    profileLink: '/admin/profile',
  },
  superadmin: {
    name: 'Super Admin',
    email: 'super@nexus.com',
    avatarFallback: 'SA',
    profileLink: '/superadmin/profile',
  },
  'team-leader': {
    name: 'Team Leader',
    email: 'leader@nexus.com',
    avatarFallback: 'TL',
    profileLink: '/team-leader/profile',
  },
  staff: {
    name: 'Staff User',
    email: 'staff@nexus.com',
    avatarFallback: 'S',
    profileLink: '/staff/profile',
  },
};

export function UserNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null; // Get email from localStorage

    if (storedRole && roleData[storedRole]) {
      setCurrentUser({
        ...roleData[storedRole],
        email: storedEmail || roleData[storedRole].email, // Use storedEmail or fallback
      });
    } else {
      setCurrentUser(null);
    }
  }, [pathname]);


  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
    }
    router.push('/login');
  };
  
  if (!currentUser) {
    return null; // Or a loading skeleton
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-auto rounded-full px-2">
            <div className='flex items-center gap-3'>
                <div className='text-right hidden sm:block'>
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {currentUser.email}
                    </p>
                </div>
                <Avatar className="h-9 w-9 border-2 border-primary">
                    <AvatarImage
                        src={`https://i.pravatar.cc/150?u=${currentUser.email}`}
                        alt="User avatar"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">{currentUser.avatarFallback}</AvatarFallback>
                </Avatar>
            </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={currentUser.profileLink}>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
