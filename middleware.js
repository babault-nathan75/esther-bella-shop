import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function isAdmin(request) {
  const token = request.cookies.get('admin_session')?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET), { algorithms: ['HS256'] });
    return payload.role === 'admin';
  } catch (error) {
    return false;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Déjà connectée : pas besoin de repasser par le formulaire
  if (pathname === '/admin/login' && (await isAdmin(request))) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // 1. Pages d'administration (tout /admin sauf /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!(await isAdmin(request))) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // 2. API : tout /api/admin et /api/upload, plus les écritures du catalogue
  if (pathname.startsWith('/api') && pathname !== '/api/admin/login') {
    const adminOnly = pathname.startsWith('/api/admin') || pathname === '/api/upload';
    const isWrite = !['GET', 'HEAD'].includes(request.method);
    if ((adminOnly || isWrite) && !(await isAdmin(request))) {
      return NextResponse.json({ error: 'Authentification requise' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// /api/checkout et /api/catalog restent publics
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/api/upload', '/api/products', '/api/categories'],
};
