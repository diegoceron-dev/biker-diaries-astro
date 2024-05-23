import type { APIContext, MiddlewareNext } from "astro";
import { defineMiddleware } from "astro:middleware";

export const redirectIfAuthenticated = defineMiddleware((context: APIContext, next: MiddlewareNext) => {
  const user = context.locals.user;
  const session = context.locals.session;

  // Verifica si el usuario y la sesión no son nulos
  if (user && session) {
    // Redirige a la página principal u otra ruta adecuada
    return context.redirect("/admin");
  }

  // Si el usuario y la sesión no son válidos, continúa con la siguiente ruta
  return next();
});
