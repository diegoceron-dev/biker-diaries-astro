// src/composables/useCatalog.ts

import { ref } from 'vue';
import { useToast } from "@/components/ui/toast/use-toast";
import { setCatalogItems } from "@/store/catalogs";
import type { Catalog } from "@/store/catalogs";

// Define y exporta el composable
export function useCatalog() {
  const { toast } = useToast();
  const catalogLoading = ref(false);

  // Función para obtener los datos del catálogo desde la API
  const getData = async () => {
    catalogLoading.value = true;
    try {
      const response = await fetch("/api/catalogs/getCatalog", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Error al obtener los datos: ${response.statusText}`);
      }

      const data: Catalog[] = await response.json();
      setCatalogItems(data);
    } catch (error: any) {
      console.error("Error al obtener los datos del catálogo:", error);
      toast({
        title: "¡Uh oh! Algo ha salido mal.",
        description: error.toString(),
        variant: "destructive",
      });
    } finally {
      catalogLoading.value = false;
    }
  };

  return {
    getData,
    catalogLoading,
  };
}
