// src/composables/useCatalog.ts

import { ref } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { setEventItems } from "@/store/events";
import type { Event } from "@/store/events";

// Define y exporta el composable
export function useEvent() {
  const { toast } = useToast();
  const loading = ref(false);

  // Función para obtener los datos del catálogo desde la API
  const getMyEvents = async () => {
    loading.value = true;
    try {
      const response = await fetch("/api/events/getEvents", {
        method: "GET",
      });

      if (!response.ok)
        throw new Error(`Error al obtener los datos: ${response.statusText}`);

      const data: Event[] = await response.json();

      console.log(data)
      
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


  const createEvent = async(event: Event) => {
    loading.value = true
    try {
      const response = await fetch("/api/events/createEvent", {
        method: "POST",
        body: JSON.stringify(event)
      });

      console.log('response composable', response)

      toast({
        title: await response.text(),
      });

      window.location.href = "/events"
    }
    catch(error: any){
      console.error("Error al obtener los datos del catálogo:", error);
      toast({
        title: "¡Uh oh! Algo ha salido mal.",
        description: error.toString(),
        variant: "destructive",
      });
    }
    finally {
      loading.value = false;
    }
  }

  return {
    loading,
    getMyEvents,
    createEvent
  };
}
