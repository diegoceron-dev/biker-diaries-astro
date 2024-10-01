import type { APIRoute } from "astro";
import { db, eq, Event } from "astro:db";

export const PUT: APIRoute = async ({ request }) => {
  const requestData = await request.json();
  const { id } = requestData;

  console.log(id)

  // Buscar el evento por UUID
  const event = await db.select().from(Event).where(eq(Event.id, id));

  console.log(event)

  if (!event) {
    return new Response("Evento no encontrado", { status: 404 });
  }

  // Actualizar los campos del evento menos el uuid y userId
  await db
    .update(Event)
    .set({
      name: requestData.name,
      description: requestData.description || "",
      startDate: new Date(requestData.startDate),
      endDate: new Date(requestData.endDate),
      eventType: requestData.eventType,
      isPublic: requestData.isPublic,
      status: requestData.status,
    })
    .where(eq(Event.id, id));

  return new Response("Evento modificado exitosamente", { status: 200 });
};
