import type { APIRoute } from "astro";
import { eq } from "astro:db";
import { db, Event, Waypoint, EventStatus } from "astro:db";

export const GET: APIRoute = async ({ request }) => {
  // Obtener el userId de los parámetros de la URL
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const eventId = url.searchParams.get("eventId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (!eventId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Obtener todos los eventos
  const event = await db
    .select()
    .from(Event)
    .where(eq(Event.userId, userId) && eq(Event.id, eventId))
    .get();

  if (event === undefined) {
    return new Response(JSON.stringify({ error: "Event not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Obtener las ubicaciones por event_id
  const waypoints = await db
    .select()
    .from(Waypoint)
    .where(eq(Waypoint.eventId, event.id));

  // Obtener el estado del evento desde el catálogo `EventStatus`
  const eventStatus = await db
    .select()
    .from(EventStatus)
    .where(eq(EventStatus.id, String(event.status)))
    .get();

  // Devolver el evento con sus ubicaciones
  const eventWithWaypoints = {
    ...event,
    status: eventStatus
    ? {
        id: eventStatus.id,
        name: eventStatus.name, // Nombre legible del estado
      }
    : null, // Si no se encuentra el estado
    waypoints, // Agregar las ubicaciones al evento
  };

  // Crear la respuesta JSON
  const jsonResponse = JSON.stringify(eventWithWaypoints);

  return new Response(jsonResponse, {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
};
