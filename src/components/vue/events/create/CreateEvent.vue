<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  onBeforeUnmount,
  reactive,
  watch,
} from "vue";
import DataGeneral from "@/components/vue/events/create/form/DataGeneral.vue";
import Locations from "@/components/vue/events/create/form/Locations.vue";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { useSteppers } from "@/composables/useSteppers";
import { useEvent } from "@/composables/services/useEvents";
import type { Event, Waypoint } from "@/store/events";
import { typeEventCatalog } from "@/store/catalogs";
import { useStore } from "@nanostores/vue";

onMounted(() => {});

onBeforeUnmount(() => {});

const props = defineProps({
  userId: String,
});

const useEvents = useEvent();

const { currentStepCreateEvent, setCurrentStepCreateEvent } = useSteppers(); // Usa el estado global

const cover = ref("");

const event = reactive<Event>({
  name: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  eventType: "",
  isPublic: false,
  userId: "",
  status: "upcoming",
  waypoints: [],
  cover: "",
});

const gradients = [
  "border-gray-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
  "border-gray-500 bg-gradient-to-r from-green-400 to-blue-500",
  "border-gray-500 bg-gradient-to-r from-yellow-400 to-red-500",
  "border-gray-500 bg-gradient-to-r from-pink-500 to-orange-500",
  "border-gray-500 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500",
  "border-gray-500 bg-gradient-to-r from-gray-600 to-gray-900",
  "border-gray-500 bg-gradient-to-r from-purple-500 to-indigo-500",
  "border-gray-500 bg-gradient-to-r from-teal-500 to-lime-500",
  "border-gray-500 bg-gradient-to-r from-emerald-500 via-cyan-500 to-light-blue-500",
  "border-gray-500 bg-gradient-to-r from-fuchsia-500 via-pink-600 to-rose-500",
  "border-gray-500 bg-gradient-to-r from-red-500 via-orange-400 to-amber-500",
  "border-gray-500 bg-gradient-to-r from-cool-gray-500 via-true-gray-600 to-warm-gray-700",
];

const selectedGradient = ref(null);

const selectGradient = (gradient: any) => {
  selectedGradient.value = gradient;
  event.color = gradient;
};

const onSaveDataGeneral = (data: { form: any; cover: string }) => {
  event.name = data.form.name;
  event.description = data.form.description;
  event.startDate = data.form.startDate;
  event.endDate = data.form.endDate;
  event.eventType = data.form.eventType;
  event.isPublic = data.form.isPublic;
  event.userId = props.userId;
  event.status = data.form.status;
  event.waypoints = data.form.waypoints;
  
  if (data.cover) {
    event.cover = data.cover;
    cover.value = data.cover;
  }
};

const onSaveLocations = (waypoints: Waypoint[]) => {
  event.waypoints = waypoints;

  useEvents.createEvent(event);
};

watch(event, (newValue, oldValue) => {
  console.log("Evento actualizado:", newValue);
});
</script>

<template>
  <div class="flex flex-col" v-auto-animate>
    <div class="w-full border-dashed border-2 border-gray-400 rounded-md">
      <div
        :class="[
          selectedGradient,
          'w-full flex items-center justify-center transition-all rounded-t-md',
          selectedGradient ? 'h-36' : '',
        ]"
      ></div>
      <div class="p-8">
        <DataGeneral
          v-show="currentStepCreateEvent === 1"
          :userId="userId"
          :gradients="gradients"
          @setGradient="selectGradient"
          @onSubmit="(value: any) => onSaveDataGeneral(value)"
        />

        <Locations
          v-show="currentStepCreateEvent === 2"
          :userId="userId"
          @onSubmit="(value: any) => onSaveLocations(value)"
        />
      </div>
    </div>
  </div>
</template>
