// src/composables/useCatalog.ts

import { ref, reactive } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { setEventItems, getEventById } from "@/store/events";
import type { Event } from "@/store/events";

// Define y exporta el composable
export function useEvent() {
  const { toast } = useToast();
  const loading = ref(false);

  // Función para obtener los datos del catálogo desde la API
  const getMyEvents = async (userId: string) => {
    loading.value = true;
    try {
      const response = await fetch(`/api/events/getEvents?userId=${userId}`, {
        method: "GET",
      });

      if (!response.ok)
        throw new Error(`Error al obtener los datos: ${response.statusText}`);

      const data: Event[] = await response.json();

      console.log(data);

      setEventItems(data);
    } catch (error: any) {
      console.error("Error al obtener los datos del catálogo:", error);
      toast({
        title: "¡Uh oh! Algo ha salido mal.",
        description: error.toString(),
        variant: "destructive",
      });
    } finally {
      loading.value = false;
    }
  };

  const getEvent = (id: string) => {
    const eventStore = getEventById(id);
    return eventStore;
  };

  const createEvent = async (event: Event) => {
    loading.value = true;
    event.status = "upcoming"
    try {
      const response = await fetch("/api/events/createEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error("Error al crear el evento");
      }

      // Parseamos la respuesta como JSON
      const data = await response.json();

      toast({
        title: `Evento creado: ${event.name}`,
        description: `ID del evento: ${data.eventId}`,
        variant: "default",
        duration: 5000,
      });

      getMyEvents(event.userId!);

      setTimeout(() => {
        window.location.href = `/events/${data.eventId}`;
      }, 2500);
    } catch (error: any) {
      console.error("Error al crear el evento:", error);
      toast({
        title: "¡Uh oh! Algo ha salido mal.",
        description: error.toString(),
        variant: "destructive",
      });
    } finally {
      loading.value = false;
    }
  };

  const updateEvent = async (event: Event) => {};

  const cancelEvent = async (event: Event) => {
    try {
      loading.value = true;

      event.status = "cancelled";

      const response = await fetch("/api/events/putEvent", {
        method: "PUT",
        body: JSON.stringify(event),
      });

      const responseText = await response.text();

      toast({
        title: `${responseText}: ${event.name}`,
        variant: "default",
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Error al actualizar los datos del evento:", error);
      toast({
        title: "¡Uh oh! Algo ha salido mal.",
        description: error.toString(),
        variant: "destructive",
      });
    } finally {
      loading.value = false;
    }
  };

  const generateDescriptionEvent = async (values: Event) => {
    const body = {
      eventTitle: values.name,
      eventStart: new Date(values.startDate),
      eventEnd: new Date(values.endDate),
      weather: "LLUVIOSO",
      destination: "LA MARQUESA, TOLUCA MEXICO",
    };

    const response = await fetch("/api/chatgpt/eventDescription", {
      method: "POST",
      body: JSON.stringify(body),
    });

    console.log(response);
  };

  const saveEventOnMemory = async (event: Event, step: number) => {
   
  }


  return {
    loading,
    getMyEvents,
    getEvent,
    createEvent,
    updateEvent,
    cancelEvent,
    generateDescriptionEvent,
  };
}
