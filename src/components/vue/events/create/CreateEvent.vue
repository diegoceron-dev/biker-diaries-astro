<script setup lang="ts">
import { typeEventCatalog } from "@/store/catalogs";
import { useStore } from "@nanostores/vue";
import { Textarea } from "@/components/ui/textarea";
import { computed, onMounted, ref } from "vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  PlusCircleIcon,
  AudioWaveform,
} from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useEvent } from "@/composables/services/useEvents";

import { autofill } from "@mapbox/search-js-web";
// import SearchBoxMap from "@/components/vue/map/SearchBoxMap.vue";
import SearchBox from "@/components/vue/map/SearchBox.vue";

const props = defineProps({
  userId: String,
});

const placeholder = ref();

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

const catalogs = useStore(typeEventCatalog);

const useEvents = useEvent();

// const loading = ref(false);

const loading = computed(() => {
  return useEvents.loading;
});

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
    description: values.description!,
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
  }, 2000);
});

const startDate = computed({
  get: () => (values.startDate ? parseDate(values.startDate) : undefined),
  set: (val) => val,
});

const endDate = computed({
  get: () => (values.endDate ? parseDate(values.endDate) : undefined),
  set: (val) => val,
});

onMounted(() => {
  autofill({
    accessToken:
      "pk.eyJ1IjoiZGllZ29jZXJvbmRldiIsImEiOiJjbDBxNWY5OWcwOWMyM2NxbmFyNjN0cm51In0.gEWz2YRkQypcE52QUIErIA",
  });
});
</script>

<template>
  <div class="flex flex-col space-y-4 md:py-12 md:px-24 p-4">
    <div class="flex flex-col space-y-4">
      <div class="flex flex-row justify-between">
        <p class="text-2x text-slate-700">Nuevo Evento</p>
      </div>

      <Card>
        <CardContent>
          <form @submit="onSubmit" autocomplete="off" class="space-y-4">
            <div class="flex flex-col md:flex-row gap-4 md:gap-12">
              <!-- Nombre del Evento -->
              <div class="flex flex-col md:w-1/4">
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
              <div class="flex flex-col md:w-1/4">
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

            <!-- Descripción -->
            <div class="flex flex-col">
              <FormField v-slot="{ componentField }" name="description">
                <FormItem v-auto-animate>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      rows="5"
                      placeholder="Descripción del evento (opcional, mín. 2 caracteres, máx. 500)."
                      class="resize-none"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <!-- Fecha de Inicio y Fecha de Término -->
            <div class="flex flex-col md:flex-row gap-4 md:gap-12">
              <!-- Fecha de Inicio -->
              <div class="flex flex-col md:w-2/6">
                <FormField v-slot="{ componentField }" name="startDate">
                  <FormItem class="flex flex-col" v-auto-animate>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger as-child>
                        <FormControl>
                          <Button
                            variant="outline"
                            :class="
                              cn(
                                'w-full text-start font-normal',
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
                                'w-full text-start font-normal',
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

            <div class="pt-4">
              <Button type="submit" class="w-full" :disabled="!loading"
                >Guardar</Button
              >
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
