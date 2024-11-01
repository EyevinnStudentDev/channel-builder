// src/middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import Cookies from 'js-cookie';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken');

  // Define protected routes
  const protectedRoutes = ['/channels', '/create', '/managePlaylists'];

  // Check if the requested route is protected
  if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL('/auth', request.url)); // Redirect to the login page if not logged in
  }

  return NextResponse.next(); // Allow the request to proceed if authenticated
}

export const config = {
  matcher: ['/channels', '/create', '/managePlaylists'], // Apply middleware to these routes
};
