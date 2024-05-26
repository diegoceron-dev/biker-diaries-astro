import type { APIContext, APIRoute } from "astro";
import { db, eq, Event } from "astro:db";

export const GET: APIRoute = async ({ params, request, props }) => {
  const events = await db.select().from(Event);

  const jsonResponse = JSON.stringify(events);

  return new Response(jsonResponse, {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
};
