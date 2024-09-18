<script setup lang="ts">
import { onMounted, h, ref, watch } from "vue";
import { useStore } from "@nanostores/vue";
import { events as eventsStore, type Event } from "@/store/events";
import { useCatalog } from "@/composables/services/useServiceCatalogs";
import { useEvent } from "@/composables/services/useEvents";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import DataTable from "@/components/vue/tableDefault/data-table/DataTable.vue";

const useServiceCatalogs = useCatalog();
const useEvents = useEvent();

const eventsList = useStore(eventsStore);

const events = ref<Event[]>([]);

const updateEvents = () => {
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
};

onMounted(async () => {
  await useServiceCatalogs.getData();
  await useEvents.getMyEvents();
  updateEvents();
});

// Watcher para actualizar la lista de eventos cuando el store cambie
watch(eventsList, () => {
  updateEvents();
});
</script>

<template>
  <div>
    <div class="flex flex-col">
      <div class="flex flex-row justify-between">
        <p class="text-xl text-slate-600 font-extralight pb-2">Mis Eventos</p>

        <a href="/events/create"><Button variant="default">Crear nuevo evento</Button></a>
      </div>
      <div class="flex flex-col flex-grow overflow-y-auto">
        <DataTable :columns="columns" :data="events" />
      </div>
    </div>
  </div>
</template>
