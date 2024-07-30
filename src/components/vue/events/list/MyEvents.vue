<script setup lang="ts">
import { onMounted, h, ref } from "vue";
import { useStore } from "@nanostores/vue";
// import { typeEventCatalog as typeEventCatalogStore } from "@/store/catalogs";
import { events as eventsStore, type Event } from "@/store/events";
import { useCatalog } from "@/composables/services/useServiceCatalogs";
import { useEvent } from "@/composables/services/useEvents";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import i18n from "@/i18n";
import DataTable from "@/components/vue/tableDefault/data-table/DataTable.vue";

const useServiceCatalogs = useCatalog();
const useEvents = useEvent();

// const catalog = useStore(typeEventCatalogStore);
const eventsList = useStore(eventsStore);

const events = ref<Event[]>([]);

onMounted(async () => {
  await useServiceCatalogs.getData();
  await useEvents.getMyEvents();

  const eventsData = eventsList.value;

  if (eventsData) {
    events.value = Object.values(eventsData)
      .map((event) => ({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      }))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }
});
</script>

<template>
  <div>
    <div class="flex flex-col space-y-4 md:py-12 md:px-24 p-4">
      <div class="flex flex-row justify-between">
        <p class="text-2x">Mis Eventos</p>
        <a href="/events/create"><Button>Crear nuevo evento</Button></a>
      </div>
      <div class="flex flex-col flex-grow overflow-y-auto">
        <DataTable :columns="columns" :data="events" />
      </div>
    </div>
  </div>
</template>
