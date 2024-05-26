<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import { typeEventCatalog } from "@/store/catalogs";
import { useCatalog } from "@/composables/services/useServiceCatalogs";

const catalog = useStore(typeEventCatalog);
const useServiceCatalogs = useCatalog();

// Obtener datos al montar el componente
onMounted(() => {
  useServiceCatalogs.getData(); 
});
</script>

<template>
  <div>
    <div class="flex flex-col space-y-4 py-12 px-24">
      <div class="flex flex-row justify-between">
        <p class="text-3xl text-gray-600">Mis Eventos</p>
        <div>
          <a href="/events/create">
            <button
              class="w-full text-white bg-secondary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transform transition duration-500 hover:scale-110 cursor-pointer"
            >
              Crear nuevo evento
            </button>
          </a>
        </div>
      </div>
      <div class="flex flex-col border-gray-200 border-2 rounded-xl py-4 px-8">
        <div
          v-if="Object.keys(catalog).length === 0"
          class="text-gray-400 md:h-[400px]"
        >
          Sin eventos
        </div>
        <div v-else class="space-y-2">
          <div v-for="item in catalog" :key="item.id" class="event-item">
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
