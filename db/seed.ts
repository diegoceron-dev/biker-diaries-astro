import {
  db,
  EventParticipationStatus,
  InvitationRequestStatus,
  EventType,
  Event,
  WaypointType
} from "astro:db";

export default async function seed() {
  await db.insert(EventParticipationStatus).values([
    { id: "invited", description: "Invited" },
    { id: "accepted", description: "Accepted" },
    { id: "declined", description: "Declined" },
  ]);

  await db.insert(InvitationRequestStatus).values([
    { id: "pending", description: "Pending" },
    { id: "approved", description: "Approved" },
    { id: "rejected", description: "Rejected" },
  ]);

  await db.insert(EventType).values([
    { id: "friends_ride", description: "Paseo con amigos" },
    { id: "rally", description: "Rally" },
    { id: "time_competition", description: "Competencia de tiempo" },
    { id: "other", description: "Otros" },
  ]);

  await db.insert(WaypointType).values([
    { id: "start", name: "start" },
    { id: "end", name: "end" },
    { id: "waypoint", name: "waypoint" },
  ]);

  // Insertar un evento
  await db.insert(Event).values([
    {
      id: "123123123",
      name: "Mountain Ride",
      description: "A scenic ride through the mountains.",
      startDate: new Date("2024-06-01T08:00:00.000Z"),
      endDate: new Date("2024-06-01T18:00:00.000Z"),
      eventType: "friends_ride",
      isPublic: true,
    },
    {
      id: "123112312323123",
      name: "INSANE 2024",
      description: "A scenic ride through the mountains.",
      startDate: new Date("2024-06-01T08:00:00.000Z"),
      endDate: new Date("2024-06-01T18:00:00.000Z"),
      eventType: "time_competition",
      isPublic: true,
    },
    {
      id: "123123124",
      name: "LAS ALBERCAS",
      description: "A scenic ride through the mountains.",
      startDate: new Date("2024-06-01T08:00:00.000Z"),
      endDate: new Date("2024-06-01T18:00:00.000Z"),
      eventType: "friends_ride",
      isPublic: true,
    },
    {
      id: "123112312323125",
      name: "LA MARQUESA",
      description: "A scenic ride through the mountains.",
      startDate: new Date("2024-06-01T08:00:00.000Z"),
      endDate: new Date("2024-06-01T18:00:00.000Z"),
      eventType: "time_competition",
      isPublic: true,
    },
    {
      id: "122",
      name: "ANIVER BMS",
      description: "A scenic ride through the mountains.",
      startDate: new Date("2024-06-01T08:00:00.000Z"),
      endDate: new Date("2024-06-01T18:00:00.000Z"),
      eventType: "time_competition",
      isPublic: true,
    }
  ]);

}
