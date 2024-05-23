import type { APIContext, MiddlewareNext } from 'astro';

export async function authMiddleware(context: APIContext, next: MiddlewareNext) {
  const user = context.locals.user;
  const session = context.locals.session;

  // Verifica si el usuario y la sesión no son nulos
  if (!user || !session) {
    // Redirige a la página de inicio de sesión o a otra ruta
    return context.redirect('/login');
  }

  // Si el usuario y la sesión son válidos, continúa con la siguiente ruta
  return next();
}
