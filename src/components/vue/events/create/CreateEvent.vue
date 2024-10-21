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

onMounted(() => {
  selectedGradient.value = gradients[0];
});

onBeforeUnmount(() => {
  setCurrentStepCreateEvent(1);
});

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
  "border-gray-500 bg-gradient-to-r from-skyBrand to-indigoBrand", // Combinación suave de azul cielo a índigo
  "border-gray-500 bg-gradient-to-r from-blue-300 to-blue-700", // Grises más suaves y menos saturados
  "border-gray-500 bg-gradient-to-r from-teal-400 to-blueBrand", // Gradiente de teal a azul suave
  "border-gray-500 bg-gradient-to-r from-orange-400 to-orangeBrand", // Gradiente de tonos naranjas más modernos
  "border-gray-500 bg-gradient-to-r from-rose-400 via-pink-500 to-orangeBrand", // De rosa a naranja, cálido y vibrante
  "border-gray-500 bg-gradient-to-r from-indigoBrand via-skyBrand to-yellow-400", // Azul cielo a amarillo con tonos índigo
  "border-gray-500 bg-gradient-to-r from-purple-500 to-indigoBrand", // De morado a índigo
  "border-gray-500 bg-gradient-to-r from-teal-500 to-lime-500", // Verde lima y teal más modernos
  "border-gray-500 bg-gradient-to-r from-emerald-500 via-cyan-500 to-skyBrand", // De esmeralda a azul cielo, frescura
  "border-gray-500 bg-gradient-to-r from-fuchsia-500 via-rose-500 to-pink-600", // De fucsia a rosa intenso
  "border-gray-500 bg-gradient-to-r from-red-500 via-orange-400 to-amber-500", // De rojo a ámbar, vibrante y cálido
  "border-gray-500 bg-gradient-to-r from-cool-gray-500 via-true-gray-600 to-warm-gray-700", // Grises neutros y balanceados
];

const selectedGradient = ref('');

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
          selectedGradient ? 'h-24' : '',
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
