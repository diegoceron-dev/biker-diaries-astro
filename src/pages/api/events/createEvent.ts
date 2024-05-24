import type { APIContext, APIRoute } from "astro";
import { db, eq, Event } from "astro:db";

export const POST: APIRoute = async ({ request }) => {
  console.log(request);

//   await db.insert(Event).values([
//     {
//       creatorId: "",
//       endDate: new Date(),
//       eventType: "",
//       id: "",
//       location: "",
//       name: "",
//       startDate: new Date,
//       description: "",
//       isPublic: true,
//     },
//   ]);

  return new Response("Evento creado exitosamente", { status: 200 });
};
