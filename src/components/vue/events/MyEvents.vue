<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "@nanostores/vue";
import {
  typeEventCatalog as typeEventCatalogStore,
  type Catalog,
} from "@/store/catalogs";
import { events as eventsStore, type Event } from "@/store/events";
import { useCatalog } from "@/composables/services/useServiceCatalogs";
import { useEvent } from "@/composables/services/useEvents";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateFormatter } from "@internationalized/date";
import { Badge } from "@/components/ui/badge";

const useServiceCatalogs = useCatalog();
const useEvents = useEvent();

const catalog = useStore(typeEventCatalogStore);
const events = useStore(eventsStore);

// Obtener datos al montar el componente
onMounted(async () => {
  await useServiceCatalogs.getData();
  await useEvents.getMyEvents();
});

const df = new DateFormatter("es-MX", {
  dateStyle: "medium",
});

const showDate = (item: Event) => {
  return `${df.format(new Date(item.endDate))} al ${df.format(
    new Date(item.endDate)
  )} con destino a Tal Lugar`;
};


const showEventType = (item: Event) => {
  return `${catalog.value[item.eventType].description}`;
};
</script>

<template>
  <div>
    <div class="flex flex-col space-y-4 py-12 px-24">
      <div class="flex flex-row justify-between">
        <p class="text-3xl text-gray-600">Mis Eventos</p>
        <div>
          <a href="/events/create">
            <button
              class="w-full bg-primary text-white focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transform transition duration-500 hover:scale-110 cursor-pointer"
            >
              Crear nuevo evento
            </button>
          </a>
        </div>
      </div>
      <div class="flex flex-col flex-grow overflow-y-auto">
        <div v-if="Object.keys(events).length === 0" class="text-gray-400">
          Sin eventos
        </div>
        <div v-else>
          <div class="flex flex-wrap">
            <div
              v-for="item in events"
              :key="item.id"
              class="w-full md:w-1/2 px-2.5 py-2.5"
            >
              <div
                class="shadow-md rounded-lg overflow-hidden border border-border transform transition duration-200 hover:scale-[101%] cursor-pointer bg-gray-50 text-[#566171]"
              >
                <div class="flex">
                  <!-- Section for Information -->
                  <div class="w-2/3 p-6">
                    <h2 class="text-[16px] font-bold mb-2">
                      {{ item.name.substring(0, 30) }}...
                    </h2>
                    <p class="text-[12px] text-gray-700 mb-2">
                      {{ item.description.substring(0, 40) }}...
                    </p>
                    <p class="text-[12px] text-gray-700">
                      {{ showDate(item) }}
                    </p>
                    <Badge variant="outline" class="text-dark border border-primary">
                      {{ showEventType(item) }}
                    </Badge>
                  </div>
                  <!-- Section for Image -->
                  <div class="w-1/3">
                    <img
                      src="https://images.unsplash.com/photo-1558981001-5864b3250a69"
                      alt="Imagen del Evento"
                      class="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
