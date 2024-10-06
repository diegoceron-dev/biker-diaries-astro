<script setup lang="ts">
import { typeEventCatalog } from "@/store/catalogs";
import { useStore } from "@nanostores/vue";
import { computed, onMounted, ref, onBeforeUnmount, reactive } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import DataGeneral from "@/components/vue/events/create/form/DataGeneral.vue";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
// @ts-ignore
import { toDate } from "radix-vue/date";
import {
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useEvent } from "@/composables/services/useEvents";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Waypoint } from "@/store/events";

onBeforeUnmount(() => {});

const props = defineProps({
  userId: String,
});

const placeholder = ref();

const editorContent = ref<string>("");

const editorRef = ref(null);

// Opciones de inicialización del editor
const editorInitOptions = {
  toolbar_mode: "sliding",
  plugins:
    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
  toolbar:
    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
  tinycomments_mode: "embedded",
  tinycomments_author: "Author name",
  mergetags_list: [
    { value: "First.Name", title: "First Name" },
    { value: "Email", title: "Email" },
  ],
  // AI request con Promise correctamente manejado
  ai_request: (request: any, respondWith: any) => {
    return respondWith.string(() =>
      Promise.reject("See docs to implement AI Assistant")
    );
  },
};

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

const catalogs = useStore(typeEventCatalog);

const useEvents = useEvent();

const loading = computed(() => {
  return useEvents.loading;
});

const maxLocations = 5;

interface LocationItem {
  id: number;
  name: string;
  // type: string;
  open: boolean;
  selectedStatus: Status | null;
}

//@ts-ignore
interface Status {
  value: string;
  label: string;
  icon: any;
}

const statusStart = {
  value: "start",
  label: "Inicio",
  icon: MapPinHouse,
};

const statusWaypoint = {
  value: "waypoint",
  label: "Parada",
  icon: Waypoints,
};

const statusEnd = {
  value: "end",
  label: "Meta",
  icon: MapPinned,
};

const locationInitialValue: LocationItem[] = [
  {
    id: 1,
    name: "",
    open: false,
    selectedStatus: statusStart,
  },
];

const statuses: Status[] = [statusStart, statusWaypoint, statusEnd];

const locations = ref<LocationItem[]>(locationInitialValue);

const addLocation = () => {
  // if (locations.value.length === maxLocations) return;

  const nextId = locations.value.findLast(() => true)?.id!;

  const newValue: LocationItem = {
    id: nextId,
    name: "",
    open: false,
    selectedStatus:
      locations.value.length >= maxLocations - 1 ? statusEnd : statusWaypoint,
  };

  newValue.id = nextId + 1;

  locations.value.push(newValue);
};

const removeLocation = (index: number) => {
  if (locations.value.length > 1) {
    locations.value.splice(index, 1); // Eliminar la ubicación en el índice dado
  }
};

const formSchema = toTypedSchema(
  z
    .object({
      name: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(50, "El nombre no puede tener más de 50 caracteres"),
      description: z
        .string()
        .min(2, "La descripción debe tener al menos 2 caracteres")
        .max(500, "La descripción no puede tener más de 500 caracteres")
        .optional(),
      startDate: z.string({
        required_error: "La fecha de inicio es obligatoria",
      }),
      endDate: z.string({ required_error: "La fecha de fin es obligatoria" }),
      eventType: z.string().min(1, "El tipo de evento es obligatorio"),
      isPublic: z.boolean().default(false),
    })
    .refine(
      (data) => {
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        return startDate <= endDate;
      },
      {
        message: "La fecha de inicio no puede ser posterior a la fecha de fin",
        path: ["endDate"],
      }
    )
);

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {},
});

const mappingLocations = () => {
  const values: Waypoint[] = locations.value.map((l, index) => ({
    id: l.id?.toString(),
    name: l.name,
    typeId: l.selectedStatus?.value.toString()!,
    sequence: index + 1,
  }));
  return values;
};

const onSubmit = handleSubmit(async (values) => {
  const waypoints = mappingLocations() ?? [];

  await useEvents.createEvent({
    description: editorContent.value || values.description!,
    name: values.name!,
    startDate: new Date(values.startDate),
    endDate: new Date(values.endDate),
    eventType: values.eventType!,
    isPublic: values.isPublic!,
    userId: props.userId,
    status: "upcoming",
    waypoints,
  });
});

const startDate = computed({
  get: () => (values.startDate ? parseDate(values.startDate) : undefined),
  set: (val) => val,
});

const endDate = computed({
  get: () => (values.endDate ? parseDate(values.endDate) : undefined),
  set: (val) => val,
});

const getPlaceholder = (index: number) => {
  return `Ingrese ubicación ${index + 1}`;
};

onMounted(() => {});

const validateLocations = (location: LocationItem) => {
  if (location.selectedStatus?.value === statusStart.value) {
  }
};

const turnTinyMceIntoEditor = ref(false);
</script>

<template>
  <form @submit="onSubmit" autocomplete="off" class="space-y-8">
    <!-- Ubicaciones -->
    <div class="flex flex-col md:w-6/6">
      <!-- Bloque para ubicaciones dinámicas -->
      <div class="flex flex-col space-y-4 md:w-6/6">
        <span
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700"
          >Ubicaciones</span
        >

        <div
          v-for="(location, index) in locations"
          :key="index"
          class="flex gap-2 items-center"
        >
          <Popover>
            <PopoverTrigger as-child>
              <div class="relative w-full max-w-sm items-center">
                <Input
                  v-model="locations[index].name"
                  type="text"
                  :placeholder="getPlaceholder(index)"
                  class="w-full pl-10"
                />
                <span
                  class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
                >
                  <Map class="size-6 text-slate-400/70" />
                </span>
              </div>
            </PopoverTrigger>
            <!--  <PopoverContent
                      class="w-auto p-2"
                      v-if="locations[index].name !== ''"
                      align="end"
                    >
                      <p>
                        Ubicación {{ index + 1 }}: {{ locations[index].name }}
                      </p>
                    </PopoverContent> -->
          </Popover>

          <Popover v-model:open="location.open">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                size="default"
                class="justify-start w-[100px] text-center"
              >
                <template v-if="location.selectedStatus">
                  <component
                    :is="location.selectedStatus?.icon"
                    class="h-5 w-5 shrink-0"
                  />
                  <span class="pl-1">{{ location.selectedStatus?.label }}</span>
                </template>
                <template v-else>
                  <MapPinOff class="size-6 text-slate-400/70" />
                </template>
              </Button>
            </PopoverTrigger>
            <PopoverContent class="p-0" side="right" align="start">
              <Command>
                <CommandInput placeholder="Change status..." />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      v-for="status in statuses"
                      :key="status.value"
                      :value="status.value"
                      @select="
                        (value) => {
                          location.selectedStatus = status;
                          location.open = false;
                          validateLocations(location);
                        }
                      "
                    >
                      <component
                        :is="status.icon"
                        :key="status.value"
                        :class="
                          cn(
                            'mr-2 h-4 w-4',
                            status.value === location.selectedStatus?.value
                              ? 'opacity-100'
                              : 'opacity-40'
                          )
                        "
                      />
                      <span>{{ status.label }}</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <!-- Botón para eliminar ubicacion actual -->
          <Button
            type="button"
            variant="outline"
            :disabled="locations.length === 1"
            @click="removeLocation(index)"
          >
            <XIcon class="ms-auto h-5 w-5 opacity-50 text-red-600" />
          </Button>
        </div>

        <!-- Botón para agregar una nueva ubicación -->
        <Button
          type="button"
          variant="outline"
          :disabled="locations.length >= maxLocations"
          @click="addLocation"
          class="w-2/6"
        >
          Agregar Ubicación
        </Button>
      </div>
    </div>

    <!--  {{ locations }} -->

    <!-- <InputSearchBox /> -->

    <div class="flex flex-col justify-end">
      <Button type="submit" class="w-2/6" :disabled="!loading">Continuar</Button>
    </div>
  </form>
</template>
