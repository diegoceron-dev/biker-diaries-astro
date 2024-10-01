import { lucia } from "@/auth";
import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
  if (!context.locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  await lucia.invalidateSession(context.locals.session.id);

  const sessionCookie = lucia.createBlankSessionCookie();

  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  //return context.redirect("/");
  
  return new Response(
    JSON.stringify({ message: "logout", clearLocalStorage: true }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  );
}
