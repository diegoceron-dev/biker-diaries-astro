<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useEvent } from "@/composables/services/useEvents";
import { useStore } from "@nanostores/vue";
import { events as eventsStore, type Event } from "@/store/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EarthLock,
  Earth,
  Calendar as CalendarIcon,
  XCircle,
  XIcon,
  LocateFixedIcon,
  Locate,
  Map,
  LucideMapPin,
  MapPinOff,
  MapPinned,
  Waypoints,
  MapPinHouse,
} from "lucide-vue-next";
import { Skeleton } from "@/components/ui/skeleton";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const useEvents = useEvent();

// const eventsList = useStore(eventsStore);

const bgColor = ref<string>("");

const event = ref<Event | undefined>(undefined);

// Lifecycle hook
onMounted(async () => {
  const result = await useEvents.getEvent(props.userId, props.id);

  event.value = result;
  // Selecciona un color aleatorio al montar el componente
  // bgColor.value = colors[Math.floor(Math.random() * colors.length)];
});

// Watcher para actualizar la lista de eventos cuando el store cambie
/* watch(eventsList, () => {
  updateEvents();
}); */
/* 
const colors = [
  "bg-gradient-to-r from-violet-200 to-indigo-400",
  "bg-gradient-to-r from-red-200 to-orange-400",
  "bg-gradient-to-r from-rose-200 to-red-500",
  "bg-gradient-to-r from-pink-200 to-rose-500",
  "bg-gradient-to-r from-amber-200 to-yellow-400",
  "bg-gradient-to-r from-amber-200 to-yellow-500",
  "bg-gradient-to-r from-amber-200 to-pink-500",
  "bg-gradient-to-r from-violet-200 to-pink-200",
  "bg-gradient-to-r from-blue-200 to-cyan-200",
  "bg-gradient-to-r from-teal-200 to-teal-500",
  "bg-gradient-to-r from-lime-200 to-lime-500",
  "bg-gradient-to-r from-teal-200 to-yellow-200",
  "bg-gradient-to-r from-emerald-400 to-cyan-400",
  "bg-gradient-to-r from-cyan-200 to-blue-500",
  "bg-gradient-to-r from-neutral-200 to-stone-400",
  "bg-gradient-to-r from-slate-200 to-slate-400",
];
 */
// Definir clases de Tailwind CSS basadas en el valor del status
const statusClasses = {
  upcoming: "bg-indigo-200/50 text-indigo-800 border-indigo/50",
  cancelled: "bg-red-200/50 text-red-800 border-red/50",
  default: "bg-cyan-100/50 text-cyan-800 border-cyan/50",
};

// Seleccionar la clase correspondiente o usar la clase por defecto
const selectedClass = computed(() => {
  return (
    statusClasses[event.value?.status as keyof typeof statusClasses] ||
    statusClasses.default
  );
});

const dates = computed(() => {
  if (!event.value) return "";

  // Asegurarse de que las fechas sean Date válidas
  const startDate = new Date(event.value.startDate);
  const endDate = new Date(event.value.endDate);

  // Agregar un día a cada fecha
  startDate.setDate(startDate.getDate() + 1);
  endDate.setDate(endDate.getDate() + 1);

  // Opciones para formatear la fecha
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Mexico_City", // Ajusta la zona horaria si es necesario
  };

  // Convertir la fecha de inicio
  const start = startDate.toLocaleDateString("es-ES", options);

  // Convertir la fecha de fin
  const end = endDate.toLocaleDateString("es-ES", options);

  return `${start} - ${end}`;
});

const getColorOrCover = () => {
  const cover = event.value?.cover?.replace(/\?_a=DATAg1AAZAA0$/, "");
  const color = event.value?.color ?? "bg-indigoBrand";

  // Verificar si el cover es una cadena válida y no está vacía
  const hasCover = typeof cover === "string" && cover.trim() !== "";

  return hasCover
    ? `bg-cover bg-center bg-[url('${cover.toString()}')] min-h-[200px]`
    : color;
};

const loading = computed(() => {
  return useEvents.loading.value;
});
</script>

<template>
  <div class="flex flex-col">
    <div v-if="loading">
      <div class="flex flex-col space-y-3">
        <Skeleton class="h-[125px] w-full rounded-xl" />
        <div class="space-y-2">
          <Skeleton class="h-4 w-[100%]" />
          <Skeleton class="h-4 w-[100%]" />
          <Skeleton class="h-4 w-[100%]" />
          <Skeleton class="h-4 w-[100%]" />

          <Skeleton class="h-[40px] w-[100%]" />
          <Skeleton class="h-4 w-[40%]" />
          <Skeleton class="h-4 w-[40%]" />
        </div>
      </div>
    </div>

    <!-- Si no hay loading, verifica si el evento fue encontrado -->
    <div v-else-if="event">
      <Card>
        {{ getColorOrCover() }}
        <CardHeader
          :class="[
            'flex flex-col gap-y-1.5 p-6 relative rounded-t-md',
            getColorOrCover(),
          ]"
        >
          <!-- Overlay semi-transparente -->
          <div class="absolute inset-0 rounded-t-md bg-gradient-to-t from-black/60 to-transparent"></div>
          <!-- Contenido del header -->
          <div class="relative z-10 p-4">
            <CardTitle
              class="flex flex-row justify-between gap-2 text-white text-2xl font-bold drop-shadow-lg"
            >
              <span>{{ event.name }}</span>
              <span v-if="event.isPublic">
                <Earth :size="32" />
              </span>
              <span v-else>
                <EarthLock :size="32" />
              </span>
            </CardTitle>
            <CardDescription
              class="flex flex-col sm:flex-row justify-end text-white text-base drop-shadow-md mt-2 gap-x-2 gap-y-2"
            >
              <span
                class="bg-white/20 backdrop-blur-md border border-white/50 rounded-full shadow-lg px-2 py-1 text-lg"
              >
                {{ dates }}
              </span>
              <span
                :class="`px-2 py-1 backdrop-blur-md border rounded-full shadow-lg text-xl capitalize bg-white/20 border-white/50`"
              >
                {{ event.status }}
              </span>
              <span
                :class="`px-2 py-1 backdrop-blur-md border rounded-full shadow-lg text-xl capitalize bg-white/20 border-white/50`"
              >
                {{ event.eventType.replace(/_/g, " ") }}
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <p class="text-base font-semibold">Descripción</p>
            <p class="text-base" v-html="event.description"></p>
          </div>
          <div class="pt-4 flex flex-col space-y-2">
            <p class="text-base font-semibold">Ubicaciones</p>
            <div
              class="flex flex-col"
              v-for="waypoint in event.waypoints"
              :key="waypoint.id"
            >
              <div class="flex flex-row justify-items-start space-x-2">
                <span class="text-base font-extralight pb-2">
                  <MapPinHouse
                    class="size-6 text-slate-400/70"
                    v-if="waypoint.typeId === 'start'"
                  />
                  <Waypoints
                    class="size-6 text-slate-400/70"
                    v-if="waypoint.typeId === 'waypoint'"
                  />
                  <MapPinned
                    class="size-6 text-slate-400/70"
                    v-if="waypoint.typeId === 'end'"
                  />
                </span>
                <span class="text-base font-extralight pb-2 capitalize">
                  {{ waypoint.sequence }}.
                </span>
                <span class="text-base font-extralight pb-2 capitalize">
                  {{ waypoint.name }}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>

    <!-- Muestra el mensaje de "No se encontró el Evento" solo después del retraso -->
    <!--  <div v-else-if="useEvents.notFound">
      <p>No se encontró el Evento</p>
      <p><a href="/">Regresar al inicio</a></p>
    </div> -->
  </div>
</template>
