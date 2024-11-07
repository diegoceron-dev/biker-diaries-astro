// src/composables/useCatalog.ts

import { ref, reactive } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { setEventItems, getEventById, addEvent } from "@/store/events";
import type { Event } from "@/store/events";

// Define y exporta el composable
export function useEvent() {
  const { toast } = useToast();
  const loading = ref(false);
  const notFound = ref(false);

  // Función para obtener los datos del catálogo desde la API
  const getMyEvents = async (userId: string) => {
    try {
      loading.value = true;

      const response = await fetch(`/api/events/getEvents?userId=${userId}`, {
        method: "GET",
      });

      if (!response.ok)
        throw new Error(`Error al obtener los datos: ${response.statusText}`);

      const data: Event[] = await response.json();

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

  const getEvent = async (userId: string, id: string) => {
    try {
      loading.value = true;
      notFound.value = false;

      const response = await fetch(
        `/api/events/getEventById?userId=${userId}&eventId=${id}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        setTimeout(() => {
          notFound.value = true;
        }, 2500);

        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }
      const data: Event = await response.json();

      addEvent(data.id!, data);

      return data;
    } catch (error: any) {
      console.error("Error al obtener los datos del evento:", error);
      toast({
        title: "¡Uh oh! Algo ha salido mal.",
        description: error.toString(),
        variant: "destructive",
      });
    } finally {
      loading.value = false;
    }
  };

  const createEvent = async (event: Event) => {
    loading.value = true;
    event.status = "upcoming";
    console.log(event);
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

      getMyEvents(event.userId!);

      setTimeout(() => {
        toast({
          title: `Evento creado: ${event.name}`,
          description: `ID del evento: ${data.eventId}`,
          variant: "default",
          duration: 5000,
        });  
      }, 1000);

      window.location.href = `/events/${data.eventId}`;
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
  };

  return {
    loading,
    notFound,
    getMyEvents,
    getEvent,
    createEvent,
    updateEvent,
    cancelEvent,
    generateDescriptionEvent,
  };
}
