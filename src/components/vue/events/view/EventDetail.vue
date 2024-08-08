<script setup lang="ts">
import { typeEventCatalog } from "@/store/catalogs";
import { computed, onMounted, ref } from "vue";
import { useEvent } from "@/composables/services/useEvents";
import type { Event } from "@/store/events";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const useEvents = useEvent();

const bgColor = ref<string>("");
const event = ref<Event | undefined>(undefined);

// Lifecycle hook
onMounted(() => {
  const value = useEvents.getEvent(props.id);
  event.value = value;
  // Selecciona un color aleatorio al montar el componente
  bgColor.value = colors[Math.floor(Math.random() * colors.length)];
});

const loading = computed(() => {
  return useEvents.loading;
});

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

// Definir clases de Tailwind CSS basadas en el valor del status
const statusClasses = {
  upcoming: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  default: "bg-gray-100 text-gray-800",
};

// Seleccionar la clase correspondiente o usar la clase por defecto
const selectedClass = computed(() => {
  return (
    statusClasses[event.value?.status as keyof typeof statusClasses] ||
    statusClasses.default
  );
});
</script>

<template>
  <div class="flex flex-col space-y-4 md:py-12 md:px-24 p-4">
    <div class="flex flex-col space-y-4" v-if="event !== undefined">
      <Card>
        <CardHeader
          class="relative rounded-t-md bg-[url('https://images.unsplash.com/photo-1558979159-2b18a4070a87?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center"
        >
          <!-- Overlay semi-transparente -->
          <div class="absolute inset-0 bg-black/40 rounded-t-md"></div>

          <!-- Contenido del header -->
          <div class="relative z-10 p-4">
            <CardTitle class="text-white text-xl font-bold drop-shadow-lg">
              {{ event.name }}
            </CardTitle>
            <CardDescription class="text-white text-sm drop-shadow-md mt-2">
              {{
                new Date(event.startDate.toString()).toLocaleDateString(
                  "es-ES",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )
              }}

              <span
                :class="`px-2 py-1 rounded-full text-xs font-semibold ${selectedClass}`"
              >
                {{ event.status }}
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-base">{{ event.description }}</p>
        </CardContent>
        <CardFooter> </CardFooter>
      </Card>
    </div>
  </div>
</template>
