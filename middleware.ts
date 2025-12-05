import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the exact top-level paths for each role's dashboard/pages.
// Superadmin is explicitly given access to paths for all roles.
const roleAuthorizedBasePaths: Record<string, string[]> = {
  'superadmin': ['/superadmin', '/admin', '/team-leader', '/staff'], // Superadmin can access paths starting with any of these
  'admin': ['/admin'],
  'team-leader': ['/team-leader'],
  'staff': ['/staff'],
};

// Map roles to their specific starting dashboard page
const defaultDashboardForRole: Record<string, string> = {
  'superadmin': '/superadmin/dashboard',
  'admin': '/admin/users/team-leader', // Specific admin dashboard for users
  'team-leader': '/team-leader/dashboard',
  'staff': '/staff/dashboard',
};

// Function to check if a user with a given role is authorized for a given pathname
function isAuthorized(role: string | undefined, pathname: string): boolean {
  if (!role || !roleAuthorizedBasePaths[role]) {
    return false; // No role or invalid role definition
  }

  // Superadmin has broad access
  if (role === 'superadmin') {
    for (const base of roleAuthorizedBasePaths['superadmin']) {
      if (pathname.startsWith(base)) {
        return true;
      }
    }
  } else {
    // For other roles, check against their specific base paths
    const allowedBases = roleAuthorizedBasePaths[role];
    for (const base of allowedBases) {
      if (pathname.startsWith(base)) {
        return true;
      }
    }
  }

  // Also, check if the pathname is the specific default dashboard for that role.
  // This covers cases where the dashboard path might not start with the base path,
  // or if there's a specific /dashboard for each.
  if (pathname === defaultDashboardForRole[role]) {
      return true;
  }
  
  // Explicitly allow the generic /dashboard route only if it's explicitly listed as a base path for the role.
  // Given your strict requirement, this might not be needed if all dashboards are under role-specific prefixes.
  // For now, removing the generic /dashboard from `roleAuthorizedBasePaths` and relying on specific prefixes.

  return false;
}


export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken');
  const userRole = request.cookies.get('userRole')?.value;
  const { pathname } = request.nextUrl;

  // Paths that are always allowed (static assets, API routes if they handle their own auth, root path)
  if (
    pathname.startsWith('/_next/static') ||
    pathname.startsWith('/_next/image') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/api') ||
    pathname === '/' // Root path is public
  ) {
    return NextResponse.next();
  }

  // Define public authentication paths
  const publicAuthPaths = ['/login', '/register'];

  // If user is authenticated
  if (authToken) {
    // If authenticated user tries to access public auth paths, redirect them to their dashboard
    if (publicAuthPaths.includes(pathname)) {
      const redirectPath = defaultDashboardForRole[userRole || ''] || '/login'; // Fallback to login if role/dashboard unknown
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    // Now, for authenticated users, check role-based authorization
    if (!isAuthorized(userRole, pathname)) {
      // If authenticated but not authorized, redirect to their default dashboard
      const redirectPath = defaultDashboardForRole[userRole || ''] || '/login'; // Fallback to login if role/dashboard unknown
      return NextResponse.redirect(new URL(redirectPath, request.url));
    }
    
    // Authorized, allow access
    return NextResponse.next();
  }

  // If no authToken is found and it's not a public auth path, redirect to login
  if (!publicAuthPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow unauthenticated access to public auth paths (login/register)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|_next/webpack-hmr).*)',
  ],
};