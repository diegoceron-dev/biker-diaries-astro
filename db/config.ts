import { defineDb, defineTable, column } from "astro:db";

// Definimos la tabla de catálogo para el estado de participación en eventos
export const EventParticipationStatus = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }), // ID único del estado
    name: column.text({ optional: false, unique: true }), // Nombre del estado (ej. "invited", "accepted", "declined")
  },
});

// Definimos la tabla de catálogo para el estado de solicitudes de invitación
export const InvitationRequestStatus = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }), // ID único del estado
    name: column.text({ optional: false, unique: true }), // Nombre del estado (ej. "pending", "approved", "rejected")
  },
});

export const User = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    email: column.text({ unique: true, optional: false }),
    password: column.text({ optional: true }),
    github_id: column.text({ optional: true, unique: true }),
  },
});

export const Session = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    expiresAt: column.number({ optional: false }),
  },
});

export const Motorcycle = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    name: column.text({ optional: false }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
  },
});

export const Event = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    name: column.text({ optional: false }),
    description: column.text({ optional: true }),
    startDate: column.date({ optional: false }),
    endDate: column.date({ optional: false }),
    eventType: column.text({
      optional: false,
      references: () => EventType.columns.id,
    }), // Referencia a la tabla EventType
    isPublic: column.boolean({ optional: false, default: false }), // Público o Privado
    cover: column.text({ optional: true }),
    status: column.text({
      optional: true,
      references: () => EventStatus.columns.id,
    }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
  },
});

export const EventPrice = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    eventId: column.text({
      optional: false,
      references: () => Event.columns.id,
    }), // Referencia al evento
    basePrice: column.number({ optional: false, default: 0 }), // Precio base (puede ser 0)
    tax: column.number({ optional: true, default: 0 }), // Impuesto aplicable al precio
    additionalFees: column.number({ optional: true, default: 0 }), // Cualquier otro cargo adicional
    totalPrice: column.number({
      optional: true,
      compute: ({
        basePrice,
        tax,
        additionalFees,
      }: {
        basePrice: number;
        tax?: number;
        additionalFees?: number;
      }) => {
        return basePrice + (tax || 0) + (additionalFees || 0); // Cálculo del precio total
      },
    }),
    priceType: column.text({ optional: true }), // Por ejemplo: "General", "VIP", etc.
  },
});

export const WaypointType = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    name: column.text({ optional: false, unique: true }), // 'start', 'end', 'waypoint'
  },
});

export const Waypoint = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    eventId: column.text({
      optional: false,
      references: () => Event.columns.id,
    }), // Referencia a la tabla Event
    name: column.text({ optional: false }),
    latitude: column.text({ optional: true }),
    longitude: column.text({ optional: true }),
    description: column.text({ optional: true }),
    typeId: column.text({
      optional: false,
      references: () => WaypointType.columns.id,
    }), // Referencia a la tabla WaypointType
    sequence: column.number({ optional: false }), // Secuencia para ordenar los puntos
  },
});

export const EventParticipant = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    eventId: column.text({
      optional: false,
      references: () => Event.columns.id,
    }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    statusId: column.text({
      optional: false,
      references: () => EventParticipationStatus.columns.id,
    }), // Referencia al catálogo de estado
  },
});

export const EventComment = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    eventId: column.text({
      optional: false,
      references: () => Event.columns.id,
    }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    comment: column.text({ optional: false }),
    createdAt: column.date({ optional: false }),
  },
});

export const InvitationRequest = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }),
    eventId: column.text({
      optional: false,
      references: () => Event.columns.id,
    }),
    userId: column.text({ optional: false, references: () => User.columns.id }),
    statusId: column.text({
      optional: false,
      references: () => InvitationRequestStatus.columns.id,
    }), // Referencia al catálogo de estado
  },
});

export const EventType = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }), // ID único del tipo de evento
    name: column.text({ optional: false, unique: true }), // Nombre del tipo de evento (ej. "paseo con amigos", "rally", "competencia de tiempo")
  },
});

export const EventStatus = defineTable({
  columns: {
    id: column.text({ optional: false, unique: true, primaryKey: true }), // ID único del tipo de evento
    name: column.text({ optional: false, unique: true }),
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
    WaypointType,
    EventStatus,
  },
});
