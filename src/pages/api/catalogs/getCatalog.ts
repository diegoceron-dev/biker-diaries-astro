import type { APIContext, APIRoute } from "astro";
import { db, EventType } from "astro:db";

export const GET: APIRoute = async ({ params, request, props }) => {
  console.log('get catalog')
  console.log(params, request, props)

  const catalog = await db.select().from(EventType);

  const jsonResponse = JSON.stringify(catalog);

  return new Response(jsonResponse, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
