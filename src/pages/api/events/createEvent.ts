import type { Waypoint as WaypointType } from "@/store/events";
import type { APIRoute } from "astro";
import { db, Event, Waypoint } from "astro:db";
import { v4 as uuidv4 } from "uuid";

export const POST: APIRoute = async ({ request }) => {
  const requestData = await request.json();

  const uuidEvent = uuidv4();

  const event = {
    id: uuidEvent,
    name: requestData.name,
    description: requestData.description,
    startDate: new Date(requestData.startDate),
    endDate: new Date(requestData.endDate),
    eventType: requestData.eventType,
    isPublic: requestData.isPublic,
    userId: requestData.userId,
    status: requestData.status,
  };

  const waypoints = requestData.waypoints.map((location: WaypointType) => {
    return {
      id: uuidv4(),
      name: location.name,
      typeId: location.typeId,
      sequence: location.sequence ?? null,
      latitude: location.latitude ?? null,
      longitude: location.longitude ?? null,
      description: location.description,
      eventId: uuidEvent,
      userId: requestData.userId,
    };
  });

  console.clear();
  console.log("Evento a crear: ", event);
  console.log("Waypoints a crear: ", waypoints);

  await db.insert(Event).values(event);

  await db.insert(Waypoint).values(waypoints);

  return new Response(
    JSON.stringify({
      message: "Evento creado exitosamente",
      eventId: uuidEvent,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
