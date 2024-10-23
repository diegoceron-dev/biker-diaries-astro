import { map } from "nanostores";

// Tipo de datos para los elementos del catálogo de eventos
export type Waypoint = {
  name: string;
  typeId: string;
  sequence: number;
  id?: string;
  latitude?: string;
  longitude?: string;
  description?: string;
};

export type Event = {
  id?: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  eventType: string;
  userId?: string;
  isPublic: boolean;
  cover?: string;
  color?: string;
  price?: number;
  status: string;
  waypoints?: Waypoint[];
};

export const logout = () => {
  // Limpiar el localStorage
  localStorage.clear();

  // Limpiar el store de eventos
  events.set({}); // O restablecerlo a su estado inicial

  // Redirigir a la página de inicio
  window.location.href = "/";
};

// Crear un `nanostore` para almacenar los eventos
export const events = map<Record<string, Event>>({});

//@ts-ignore
export const eventSelected = map<Event | undefined>(undefined);

// Función para agregar un evento al `nanostore` de eventos
export function addEvent(id: string, event: Event) {
  events.setKey(id, event); // Almacena el evento utilizando su ID como clave
}

// Función para seleccionar un evento
export function selectEvent(id: string) {
  const allEvents = events.get();
  eventSelected.set(allEvents[id]); // Establece el evento seleccionado
}

// Función para limpiar la selección
export function clearSelectedEvent() {
  eventSelected.set(undefined);
}

// Función para agregar o actualizar un evento
export const setEvent = (event: Event) => {
  events.setKey(event.id!, event);
};

// Función para agregar o actualizar un evento
export const setEventItem = (item: Event) => {
  events.setKey(item.id!, item);
};

// Función para agregar o actualizar múltiples eventos
export const setEventItems = (items: Event[]) => {
  for (const item of items) {
    events.setKey(item.id!, item);
  }
};

// Función para recuperar un evento por su ID
export const getEventById = (id: string): Event | undefined => {
  const allEvents = events.get();
  console.log(allEvents)
  return allEvents[id]; // Esto debería funcionar si el evento ya está en el store
};

// Función para eliminar un evento por su ID
export const deleteEventById = (id: string) => {
  const currentEvents = events.get();
  delete currentEvents[id]; // Eliminar la clave del objeto
  events.set(currentEvents); // Actualizar el estado del nanostore
};

// Ejemplo de cómo suscribirse a cambios en los eventos
events.subscribe((newEvents) => {
  console.log("Eventos actualizados:", newEvents);
});
