import type { APIRoute } from "astro";
import { db, Event } from "astro:db";

export const GET: APIRoute = async () => {
  const events = await db.select().from(Event);

  // Invertir el orden de los eventos
  const reversedEvents = events.reverse();

  const jsonResponse = JSON.stringify(reversedEvents);

  return new Response(jsonResponse, {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
};
