import {
  db,
  EventParticipationStatus,
  InvitationRequestStatus,
  EventType,
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
}
