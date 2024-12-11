<script setup lang="ts">
import {
  reactive,
  computed,
  onMounted,
  ref,
  onBeforeUnmount,
  watch,
} from "vue";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import type { Event, Waypoint } from "@/store/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { typeEventCatalog } from "@/store/catalogs";
import { useStore } from "@nanostores/vue";
import { useSteppers } from "@/composables/useSteppers";
import { useEvent } from "@/composables/services/useEvents";
import DataGeneral from "@/components/vue/events/create/newForm/DataGeneral.vue";
import Locations from "@/components/vue/events/create/newForm/Locations.vue";
import SteperHorizontal from "@/components/vue/events/create/SteperHorizontal.vue";
import { Paintbrush, Earth, EarthLock } from "lucide-vue-next";

const event = reactive<Event>({
  name: "",
  description: "",
  startDate: new Date(),
  endDate: new Date(),
  eventType: "",
  isPublic: false,
  userId: "",
  status: {
    id: "upcoming",
    name: "Por Ocurrir",
  },
  waypoints: [],
  cover: "",
});

const props = defineProps({
  userId: String,
});

const useEvents = useEvent();

const { currentStepCreateEvent, setCurrentStepCreateEvent } = useSteppers(); // Usa el estado global

onMounted(() => {
  selectedGradient.value = gradients[0];
});

onBeforeUnmount(() => {
  setCurrentStepCreateEvent(1);
});

const cover = ref("");

const gradients = [
  "border-gray-500 bg-gradient-to-r from-cyan-500 to-blue-600", // Azul pastel a azul profundo
  "border-gray-500 bg-gradient-to-r from-blue-300 via-sky-400 to-cyan-500", // Azul pastel a azul cielo moderno
  "border-gray-500 bg-gradient-to-r from-cyan-300 to-blue-500", // Cian suave a azul intenso
  "border-gray-500 bg-gradient-to-r from-cyan-300 via-teal-400 to-indigo-500", // Cian a índigo más saturado
  "border-gray-500 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600", // Esmeralda a cian con un toque de teal
  "border-gray-500 bg-gradient-to-r from-fuchsia-300 via-pink-400 to-purple-500", // Fucsia claro a púrpura medio
  "border-gray-500 bg-gradient-to-r from-fuchsia-300 via-purple-400 to-indigo-500", // Fucsia claro a índigo más profundo
  "border-gray-500 bg-gradient-to-r from-fuchsia-400 to-purple-500", // Fucsia vivo a púrpura rico
  "border-gray-500 bg-gradient-to-r from-green-300 via-teal-400 to-blue-500", // Verde suave a azul fresco
  "border-gray-500 bg-gradient-to-r from-indigo-300 via-sky-400 to-blue-500", // Índigo a azul cielo saturado
  "border-gray-500 bg-gradient-to-r from-indigo-300 to-purple-500", // Índigo pastel a púrpura moderno
  "border-gray-500 bg-gradient-to-r from-lime-300 via-green-400 to-teal-500", // Verde lima fresco a teal vibrante
  "border-gray-500 bg-gradient-to-r from-lime-300 via-teal-400 to-green-500", // Verde lima a verde medio
  "border-gray-500 bg-gradient-to-r from-orange-300 via-amber-400 to-yellow-500", // Naranja claro a amarillo cálido
  "border-gray-500 bg-gradient-to-r from-orange-400 to-yellow-500", // Naranja moderno a amarillo cálido
  "border-gray-500 bg-gradient-to-r from-pink-300 via-rose-400 to-orange-500", // Rosa pastel a naranja cálido
  "border-gray-500 bg-gradient-to-r from-pink-300 via-rose-400 to-red-500", // Rosa suave a rojo cálido
  "border-gray-500 bg-gradient-to-r from-rose-300 via-pink-400 to-orange-500", // Rosa pastel a naranja cálido
  "border-gray-500 bg-gradient-to-r from-rose-300 via-red-400 to-red-500", // Rosa claro a rojo cálido
  "border-gray-500 bg-gradient-to-r from-rose-400 to-pink-500", // Rosa vibrante a rosa intenso
  "border-gray-500 bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-500", // Azul cielo a índigo más saturado
  "border-gray-500 bg-gradient-to-r from-sky-400 to-indigo-500", // Azul cielo medio a índigo vibrante
  "border-gray-500 bg-gradient-to-r from-sky-400 via-cyan-500 to-teal-600", // Azul cielo más vivo a teal saturado
  "border-gray-500 bg-gradient-to-r from-teal-300 via-cyan-400 to-blue-500", // Teal fresco a azul más saturado
  "border-gray-500 bg-gradient-to-r from-teal-300 via-lime-400 to-green-500", // Teal pastel a verde vivo
  "border-gray-500 bg-gradient-to-r from-teal-400 to-cyan-500", // Teal medio a cian fresco
  "border-gray-500 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500", // Amarillo medio a rojo vibrante
  "border-gray-500 bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-500", // Amarillo suave a cálido
];

const selectedGradient = ref("");

const selectGradient = (gradient: any) => {
  selectedGradient.value = gradient;
  event.color = gradient;
  console.log(event.color);
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
  console.log(data.cover);
  debugger;
  if (data.cover) {
    event.cover = data.cover;
    console.log("Imagen seleccionada:", data.cover);
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

const eventTitleComputed = computed(() => {
  return eventTitle.value || "Sin titulo";
});

const eventTitle = ref<String>("");

const changeEventTitle = (value: String) => {
  eventTitle.value = value;
  ConstantSourceNode;
};

const showModalBrush = ref(false);

const showModalPrivacity = ref(false);
</script>

<template>
  <div class="flex h-full justify-center align-middle items-center pb-6">
    <SteperHorizontal />
  </div>
  <div class="flex flex-col" v-auto-animate>
    <Card>
      <CardHeader class="p-0 w-full rounded-t-md">
        <div
          :class="[
            selectedGradient,
            'w-full flex items-center justify-between transition-all rounded-t-md px-8',
            selectedGradient ? 'h-28' : '',
          ]"
        >
          <span class="text-white font-bold text-4xl drop-shadow-md">
            {{ eventTitleComputed }}
          </span>

          <div class="flex flex-row items-center justify-between gap-4">
            <span class="text-white font-bold text-xl cursor-pointer">
              <Earth
                class="w-6 h-6 text-white"
                @click="showModalPrivacity = !showModalPrivacity"
              />
            </span>
            <span class="text-white font-bold text-xl cursor-pointer">
              <Paintbrush
                class="w-6 h-6 text-white"
                @click="showModalBrush = !showModalBrush"
              />
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataGeneral
          v-show="currentStepCreateEvent == 1"
          :userId="userId"
          :gradients="gradients"
          v-model:showModalBrush="showModalBrush"
          v-model:showModalPrivacity="showModalPrivacity"
          @setGradient="selectGradient"
          @onSubmit="(value: any) => onSaveDataGeneral(value)"
          @onNameChange="(value: any) => changeEventTitle(value)"
        />

        <Locations
          v-show="currentStepCreateEvent === 2"
          :userId="userId"
          @onSubmit="(value: any) => onSaveLocations(value)"
        />
      </CardContent>
    </Card>
  </div>
</template>
