import { lucia } from "@/auth";
import type { APIContext } from "astro";
import { db, eq, User } from "astro:db";
import { Argon2id } from "oslo/password";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string") {
    return new Response("Invalid email", {
      status: 400,
    });
  }
  if (typeof password !== "string") {
    return new Response("Invalid password", {
      status: 400,
    });
  }

  const foundUser = (
    await db.select().from(User).where(eq(User.email, email))
  ).at(0);

  if (!foundUser) {
    return new Response("Incorrect email or password", { status: 400 });
  }

  if (!foundUser.password) {
    return new Response("Invalid password", {
      status: 400,
    });
  }

  const validPassword = await new Argon2id().verify(
    foundUser.password,
    password
  );

  if (!validPassword) {
    return new Response("Incorrect email or password", { status: 400 });
  }

  const session = await lucia.createSession(foundUser.id, {});
  
  const sessionCookie = lucia.createSessionCookie(session.id);
  
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return new Response("Inicio de sesión exitoso", { status: 200})
}
