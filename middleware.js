import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('admin_session')?.value;
  const { pathname } = request.nextUrl;

  // 1. Définir les routes à protéger (Tout ce qui commence par /admin sauf /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    
    // Si pas de jeton, redirection immédiate
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      // 2. Vérification de l'authenticité du jeton avec la clé secrète
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      
      // Si c'est valide, on laisse passer
      return NextResponse.next();
    } catch (error) {
      // Si le jeton est corrompu ou expiré, retour à la case départ
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// Configuration du matcher pour optimiser les performances
export const config = {
  matcher: ['/admin/:path*'],
};