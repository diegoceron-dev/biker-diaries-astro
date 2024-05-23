import type { APIContext } from "astro";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { db, eq, User } from "astro:db";
import { lucia } from "@/auth";

export async function POST(context: APIContext): Promise<Response> {
  const formData = await context.request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  

  if (!email || !password) {
    return new Response("email and Password are required", { status: 400 });
  }

  if (typeof email !== "string" || email.length < 4) {
    return new Response("email must be at least 4 characters long", {
      status: 400,
    });
  }

  if (typeof password !== "string" || password.length < 4) {
    return new Response("Password must be at least 4 characters long", {
      status: 400,
    });
  }
  
  const findEmail = await db.select().from(User).where(eq(User.email, email ));
  
  if (findEmail) {
    return new Response("Email ya se encuentra en uso", { status: 400 });
  }

  const userId = generateId(15);
  
  const hashedPassword = await new Argon2id().hash(password);

  await db.insert(User).values([
    {
      id: userId,
      email: email,
      password: hashedPassword,
    },
  ]);

  const session = await lucia.createSession(userId, {});
  
  const sessionCookie = lucia.createSessionCookie(session.id);
  
  context.cookies.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return new Response("Inicio de sesión exitoso", { status: 200})
}
