import type { APIRoute } from "astro";
import { db, Event } from "astro:db";
import { v4 as uuidv4 } from 'uuid';

export const POST: APIRoute = async ({ request }) => {
  const requestData = await request.json();
  const uuid = uuidv4(); 

    await db.insert(Event).values({
      id: uuid,
      name: requestData.name,
      description: requestData.description || "",
      startDate: new Date(requestData.startDate),
      endDate: new Date(requestData.endDate),
      eventType: requestData.eventType,
      isPublic: requestData.isPublic,
      creatorId: requestData.creatorId,
      status: requestData.status
    });
 
  return new Response("Evento creado exitosamente", { status: 200 });
};
