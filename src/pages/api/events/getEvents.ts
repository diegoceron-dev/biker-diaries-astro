import type { APIRoute } from "astro";
import { eq } from "astro:db";
import { db, Event, Waypoint } from "astro:db";

export const GET: APIRoute = async ({ request }) => {
  // Obtener el userId de los parámetros de la URL
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  console.log("UserId: ", userId);

  // Obtener todos los eventos
  const events = await db.select().from(Event).where(eq(Event.userId, userId));

  // Crear un arreglo de promesas para obtener las ubicaciones por event_id
  const eventsWithWaypoints = await Promise.all(
    events.map(async (event) => {
      // Asegúrate de que el campo se llama correctamente en la tabla Waypoint
      const waypoints = await db
        .select()
        .from(Waypoint)
        .where(eq(Waypoint.eventId, event.id));

      // Devolver el evento con sus ubicaciones
      return {
        ...event,
        waypoints, // Agregar las ubicaciones al evento
      };
    })
  );

  console.log("Events with waypoints: ", eventsWithWaypoints);

  // Invertir el orden de los eventos
  const reversedEvents = eventsWithWaypoints; //.reverse();

  // Crear la respuesta JSON
  const jsonResponse = JSON.stringify(reversedEvents);

  return new Response(jsonResponse, {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
};
