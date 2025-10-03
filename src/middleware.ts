import { defineMiddleware } from 'astro:middleware';
import { isAuthenticated } from './lib/auth';

export const onRequest = defineMiddleware((context, next) => {
  const { url, cookies, redirect } = context;

  // Proteger rutas /admin/* excepto /admin/login
  if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
    if (!isAuthenticated(cookies)) {
      return redirect('/admin/login');
    }
  }

  return next();
});
