import { defineDb, defineTable, column } from "astro:db";

// Definimos la tabla de catálogo para el estado de participación en eventos
export const EventParticipationStatus = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }), // ID único del estado
    description: column.text({ optional: false, unique: true }), // Nombre del estado (ej. "invited", "accepted", "declined")
  },
});

// Definimos la tabla de catálogo para el estado de solicitudes de invitación
export const InvitationRequestStatus = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }), // ID único del estado
    description: column.text({ optional: false, unique: true }), // Nombre del estado (ej. "pending", "approved", "rejected")
  },
});

export const User = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    email: column.text({ unique: true, optional: false }),
    password: column.text({ optional: true }),
    github_id: column.text({ optional: true, unique: true }),
  },
});

export const Session = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    expiresAt: column.number({ optional: false }),
  },
});

export const Motorcycle = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    name: column.text({ optional: false }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
  },
});

export const Event = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    name: column.text({ optional: false }),
    description: column.text({ optional: true }),
    startDate: column.date({ optional: false }),
    endDate: column.date({ optional: false }),
    eventType: column.text({ optional: false, references: () => EventType.columns.id }), // Referencia a la tabla EventType
    creatorId: column.text({ optional: true, references: () => User.columns.id }),
    isPublic: column.boolean({ optional: false, default: false }), // Público o Privado
    price: column.number({ optional: true }),
  },
});

export const WaypointType = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    name: column.text({ optional: false, unique: true }), // 'start', 'end', 'waypoint'
  },
});

export const Waypoint = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    eventId: column.text({ optional: false, references: () => Event.columns.id }), // Referencia a la tabla Event
    name: column.text({ optional: false }),
    latitude: column.text({ optional: true }),
    longitude: column.text({ optional: true }),
    description: column.text({ optional: true }),
    typeId: column.text({ optional: false, references: () => WaypointType.columns.id }), // Referencia a la tabla WaypointType
    sequence: column.number({ optional: false }), // Secuencia para ordenar los puntos
  },
});

export const EventParticipant = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    eventId: column.text({ optional: false, references: () => Event.columns.id }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    statusId: column.text({ optional: false, references: () => EventParticipationStatus.columns.id }), // Referencia al catálogo de estado
  },
});

export const EventComment = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    eventId: column.text({ optional: false, references: () => Event.columns.id }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    comment: column.text({ optional: false }),
    createdAt: column.date({ optional: false }),
  },
});

export const InvitationRequest = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }),
    eventId: column.text({ optional: false, references: () => Event.columns.id }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    statusId: column.text({ optional: false, references: () => InvitationRequestStatus.columns.id }), // Referencia al catálogo de estado
  },
});

export const EventType = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true }), // ID único del tipo de evento
    description: column.text({ optional: false, unique: true }), // Nombre del tipo de evento (ej. "paseo con amigos", "rally", "competencia de tiempo")
  },
});

export default defineDb({
  tables: {
    User,
    Session,
    Motorcycle,
    Event,
    EventParticipant,
    EventComment,
    InvitationRequest,
    EventParticipationStatus,
    InvitationRequestStatus,
    EventType,
    Waypoint,
    WaypointType
  },
});
