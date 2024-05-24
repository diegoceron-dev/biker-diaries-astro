import type { APIContext, APIRoute } from "astro";
import { db, eq, Event } from "astro:db";

export const GET: APIRoute = async ({params, request, props }) => {
  console.log(request, params, props);
  return new Response("Evento creado exitosamen", { status: 200 });
};
