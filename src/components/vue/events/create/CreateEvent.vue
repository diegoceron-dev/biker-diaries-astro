<script setup lang="ts">
import { typeEventCatalog } from "@/store/catalogs";
import { useStore } from "@nanostores/vue";
import { computed, onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
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
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
} from "lucide-vue-next";
import type { Icon } from "lucide-vue-next";
import InputSearchBox from "@/components/vue/map/InputSearchBox.vue";

// import Editor from "@tinymce/tinymce-vue";

const props = defineProps({
  userId: String,
});

const placeholder = ref();

const editorContent = ref();

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

const onSubmit = handleSubmit(async (values) => {
  await useEvents.createEvent({
    description: editorContent.value,
    name: values.name!,
    startDate: new Date(values.startDate),
    endDate: new Date(values.endDate),
    eventType: values.eventType!,
    isPublic: values.isPublic!,
    creatorId: props.userId,
    status: "upcoming",
  });

  setTimeout(() => {
    window.location.href = "/events";
  }, 1000);
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
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col space-y-4">
      <div class="flex flex-row justify-between">
        <p class="text-xl text-slate-600 font-extralight pb-2">Nuevo Evento</p>
      </div>

      <Card>
        <CardContent>
          <form @submit="onSubmit" autocomplete="off" class="space-y-4">
            <div class="flex flex-col md:flex-row gap-4 md:gap-12">
              <!-- Nombre del Evento -->
              <div class="flex flex-col md:w-2/6">
                <FormField v-slot="{ componentField }" name="name">
                  <FormItem v-auto-animate>
                    <FormLabel>Nombre del Evento</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nombre del evento (mín. 2 caracteres, máx. 50)."
                        v-bind="componentField"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <!-- Tipo de Evento -->
              <div class="flex flex-col md:w-2/6">
                <FormField v-slot="{ componentField }" name="eventType">
                  <FormItem v-auto-animate>
                    <FormLabel>Tipo de Evento</FormLabel>
                    <FormControl>
                      <Select v-bind="componentField" class="w-full">
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Selecciona tu tipo de evento"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            v-for="item in catalogs"
                            :key="item.id"
                            :value="item.id"
                          >
                            {{ item.name }}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <!-- Evento Público -->
              <div class="flex flex-col">
                <FormField v-slot="{ componentField }" name="isPublic">
                  <FormItem v-auto-animate>
                    <FormLabel>Evento Público</FormLabel>
                    <div class="flex items-center">
                      <FormControl>
                        <Switch
                          class="border dark:border-slate-700"
                          v-bind="componentField"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- Fecha de Inicio y Fecha de Término -->
            <div class="flex flex-col md:flex-row gap-4 md:gap-12">
              <!-- Fecha de Inicio -->
              <div class="flex flex-col md:w-2/6">
                <FormField v-slot="{ componentField }" name="startDate">
                  <FormItem class="flex flex-col" v-auto-animate>
                    <FormLabel class="font-thin!">Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger as-child>
                        <FormControl>
                          <Button
                            variant="outline"
                            :class="
                              cn(
                                'w-full text-start font-light',
                                !startDate && 'text-muted-foreground'
                              )
                            "
                          >
                            <span>{{
                              startDate
                                ? df.format(toDate(startDate))
                                : "Seleccionar fecha"
                            }}</span>
                            <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                          </Button>
                          <input hidden />
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0">
                        <Calendar
                          close
                          v-model:placeholder="placeholder"
                          v-model="startDate"
                          calendar-label="Fecha de inicio"
                          initial-focus
                          :min-value="new CalendarDate(1900, 1, 1)"
                          :max-value="new CalendarDate(2030, 1, 1)"
                          @update:model-value="
                      (v: any) => {
                        if (v) {
                          setFieldValue('startDate', v.toString());
                        } else {
                          setFieldValue('startDate', undefined);
                        }
                      }
                    "
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <!-- Fecha de Término -->
              <div class="flex flex-col md:w-2/6">
                <FormField v-slot="{ componentField }" name="endDate">
                  <FormItem class="flex flex-col" v-auto-animate>
                    <FormLabel>Fecha de término</FormLabel>
                    <Popover>
                      <PopoverTrigger as-child>
                        <FormControl>
                          <Button
                            variant="outline"
                            :class="
                              cn(
                                'w-full text-start font-light',
                                !endDate && 'text-muted-foreground'
                              )
                            "
                          >
                            <span>{{
                              endDate
                                ? df.format(toDate(endDate))
                                : "Seleccionar fecha"
                            }}</span>
                            <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                          </Button>
                          <input hidden />
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent class="w-auto p-0">
                        <Calendar
                          v-model:placeholder="placeholder"
                          v-model="endDate"
                          calendar-label="Fecha de término"
                          initial-focus
                          :min-value="new CalendarDate(1900, 1, 1)"
                          :max-value="new CalendarDate(2030, 1, 1)"
                          @update:model-value="
                      (v: any) => {
                        if (v) {
                          setFieldValue('endDate', v.toString());
                        } else {
                          setFieldValue('endDate', undefined);
                        }
                      }
                    "
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
            </div>

            <!-- Descripción -->
            <div class="flex flex-col md:w-6/6">
              <FormField v-slot="{ componentField }" name="description">
                <FormItem v-auto-animate>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <!--                     <Editor
                      v-model="editorContent"
                      ref="editorRef"
                      api-key=""
                      :init="{
                  toolbar_mode: 'sliding',
                  plugins:
                    'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                  toolbar:
                    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                  tinycomments_mode: 'embedded',
                  tinycomments_author: 'Author name',
                  mergetags_list: [
                    { value: 'First.Name', title: 'First Name' },
                    { value: 'Email', title: 'Email' },
                  ],
                  ai_request: (request: any, respondWith: any) =>
                    respondWith.string(() =>
                      Promise.reject('See docs to implement AI Assistant')
                    ),
                }"
                      initial-value=""
                    /> -->
                    <Textarea
                      rows="15"
                      placeholder="Descripción del evento (opcional, mín. 2 caracteres, máx. 500)."
                      class="resize-none"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

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
                    <PopoverContent
                      class="w-auto p-2"
                      v-if="locations[index].name !== ''"
                      align="end"
                    >
                      <p>
                        Ubicación {{ index + 1 }}: {{ locations[index].name }}
                      </p>
                    </PopoverContent>
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
                                    status.value ===
                                      location.selectedStatus?.value
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

            <!-- <InputSearchBox /> -->

            <div class="flex flex-col">
              <Button type="submit" class="w-2/6" :disabled="!loading"
                >Guardar</Button
              >
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
