<script setup lang="ts">
import { useToast } from "@/components/ui/toast";
import { useCatalog } from "@/composables/services/useServiceCatalogs";
import { typeEventCatalog } from "@/store/catalogs";
import { useStore } from "@nanostores/vue";
import { onMounted } from "vue";

const catalog = useStore(typeEventCatalog);
const useServiceCatalogs = useCatalog();
const { toast } = useToast();

const handleSubmit = async () => {
  try {
    const formData = new FormData();

    formData.append("item", "algo pues");

    const response = await fetch("/api/events/createEvent", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const successText = await response.text();

      toast({
        description: successText,
        variant: "default",
      });
    }
  } catch (error: any) {
    toast({
      title: "¡Uh oh! Algo ha salido mal.",
      description: error.toString(),
      variant: "destructive",
    });
  }
};

const saveEvent = async () => {};

onMounted(() => {});

</script>

<template>
  <div>
    <div class="flex flex-col space-y-4 py-12 px-24">
      <div class="flex flex-row justify-between">
        <p class="text-3xl text-gray-600">Crear Evento</p>
        <div>
          <button
            @click="saveEvent"
            class="w-full text-white bg-secondary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transform transition duration-500 hover:scale-110 cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </div>
      <div class="flex flex-col border-gray-200 border-2 rounded-xl py-4 px-8">
        <div class="text-gray-400 md:h-[400px]">
          <div
            v-if="Object.keys(catalog).length === 0"
            class="text-gray-400 md:h-[400px]"
          >
            Sin eventos
          </div>
          <form><input name="address" placeholder="Address" type="text" /></form>
        </div>
      </div>
    </div>
  </div>
</template>
