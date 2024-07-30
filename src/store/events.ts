import { map } from 'nanostores';

// Tipo de datos para los elementos del catálogo de eventos
export type Event = {
  id?: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  eventType: string;
  creatorId?: string;
  isPublic: boolean;
  cover?: string;
  price?: number;
};

// Función para leer desde localStorage (solo en el cliente)
function loadEventFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const savedEvent = localStorage.getItem('|');
    return savedEvent ? JSON.parse(savedEvent) : {};
  }
  return {};
}

// Estado del catálogo de eventos, usando un mapa para almacenar los elementos
export const events = map<Record<string, Event>>(loadEventFromLocalStorage());

// Función para agregar o actualizar un elemento en el catálogo
export const setEventItem = (item: Event) => {
  events.setKey(item.id!, item);
};

// Función para agregar o actualizar múltiples elementos en el catálogo
export const setEventItems = (items: Event[]) => {
  for (const item of items) {
    events.setKey(item.id!, item);
  }
};

// Suscribirse a cambios en el catálogo de eventos para guardar en localStorage
if (typeof window !== 'undefined') {
  events.subscribe((newItems) => {
    localStorage.setItem('events', JSON.stringify(newItems));
    console.log('Events actualizado:', newItems);
  });
}
