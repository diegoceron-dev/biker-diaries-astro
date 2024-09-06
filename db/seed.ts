import {
  db,
  EventParticipationStatus,
  InvitationRequestStatus,
  EventType,
  Event,
  WaypointType,
  EventStatus,
} from "astro:db";

export default async function seed() {
  await db.insert(EventParticipationStatus).values([
    { id: "invited", name: "Invited" },
    { id: "accepted", name: "Accepted" },
    { id: "declined", name: "Declined" },
  ]);

  await db.insert(InvitationRequestStatus).values([
    { id: "pending", name: "Pending" },
    { id: "approved", name: "Approved" },
    { id: "rejected", name: "Rejected" },
  ]);

  await db.insert(EventType).values([
    { id: "friends_ride", name: "Paseo con amigos" },
    { id: "rally", name: "Rally" },
    { id: "time_competition", name: "Competencia de tiempo" },
    { id: "other", name: "Otros" },
  ]);

  await db.insert(EventStatus).values([
    { id: "upcoming", name: "Por Ocurrir" },
    { id: "ongoing", name: "En curso" },
    { id: "cancelled", name: "Cancelado" },
    { id: "completed", name: "Terminado" },
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
      name: "Mountain Expedition: Ride the Peaks",
      description: "Join us for an exhilarating ride through some of the most breathtaking mountain ranges. This event is perfect for riders who love the thrill of steep climbs, sharp turns, and scenic vistas. Be prepared for a full day of adventure as we explore rugged terrains and enjoy the beauty of the great outdoors. The ride will culminate with a group gathering at a mountain lodge, where we’ll share stories and experiences.",
      startDate: new Date("2024-05-25T07:00:00.000Z"),
      endDate: new Date("2024-05-25T19:00:00.000Z"),
      eventType: "friends_ride",
      isPublic: true,
      status: "upcoming",
    },
    {
      id: "123112312323123",
      name: "INSANE 2024: The Ultimate Time Challenge",
      description: "INSANE 2024 is the event of the year for speed enthusiasts! Test your limits in this high-stakes time competition where the fastest riders will be crowned champions. The course is designed to challenge even the most experienced riders, with a mix of high-speed straights and technical corners. This is not just a race; it’s a battle against the clock, where every second counts. Are you ready to prove you’re the fastest?",
      startDate: new Date("2024-06-10T09:00:00.000Z"),
      endDate: new Date("2024-06-10T17:00:00.000Z"),
      eventType: "time_competition",
      isPublic: true,
      status: "ongoing",
    },
    {
      id: "123123124",
      name: "Las Albercas: Ride and Relax",
      description: "Escape the city and enjoy a day of riding and relaxation at Las Albercas. This event offers a unique blend of scenic riding through lush landscapes and the opportunity to unwind at one of the most beautiful resorts. The ride will take us through picturesque countryside, ending at a resort where you can relax by the pools, enjoy good food, and connect with fellow riders. It’s the perfect mix of adventure and leisure.",
      startDate: new Date("2024-07-05T08:00:00.000Z"),
      endDate: new Date("2024-07-05T20:00:00.000Z"),
      eventType: "friends_ride",
      isPublic: true,
      status: "upcoming",
    },
    {
      id: "123112312323125",
      name: "La Marquesa: Time Attack 2024",
      description: "Prepare yourself for the La Marquesa Time Attack, a thrilling time competition set in the stunning landscapes of La Marquesa. Riders will compete to set the fastest time on a challenging course that weaves through forests and hills. This event is a true test of skill, speed, and endurance. The competition is fierce, but the rewards are great, with the top riders earning trophies and bragging rights.",
      startDate: new Date("2024-08-15T08:00:00.000Z"),
      endDate: new Date("2024-08-15T18:00:00.000Z"),
      eventType: "time_competition",
      isPublic: true,
      status: "completed",
    },
    {
      id: "122",
      name: "ANIVER BMS: Anniversary Ride & Celebration",
      description: "Celebrate the anniversary of BMS with a special ride and event! This year, we’re marking the occasion with a memorable ride through some of the most scenic routes, followed by a grand celebration. The day will start with a group ride, leading to a venue where we’ll have food, drinks, live music, and more. It’s a time to reflect on our journey, celebrate our achievements, and look forward to the future. All riders are welcome!",
      startDate: new Date("2024-09-20T10:00:00.000Z"),
      endDate: new Date("2024-09-20T22:00:00.000Z"),
      eventType: "time_competition",
      isPublic: true,
      status: "completed",
    },
  ]);
  
}
