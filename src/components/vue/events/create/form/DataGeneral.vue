<script setup lang="ts">
import { typeEventCatalog } from "@/store/catalogs";
import { useStore } from "@nanostores/vue";
import { computed, onMounted, ref, onBeforeUnmount, defineEmits } from "vue";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDate,
  DateFormatter,
  parseDate,
} from "@internationalized/date";
// @ts-ignore
import { toDate } from "radix-vue/date";
import { Calendar as CalendarIcon } from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useEvent } from "@/composables/services/useEvents";
import { useSteppers } from "@/composables/useSteppers";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize"; // Acciones para redimensionar
import Editor from "@tinymce/tinymce-vue";

onMounted(() => {});

onBeforeUnmount(() => {});

const props = defineProps({
  userId: String,
  gradients: Array,
});

const emits = defineEmits(["onSubmit", "setGradient"]);

const { currentStepCreateEvent, setCurrentStepCreateEvent } = useSteppers(); // Usa el estado global

const catalogs = useStore(typeEventCatalog);

const useEvents = useEvent();

const placeholder = ref();

const editorContent = ref<string>("");

const turnTinyMceIntoEditor = ref(false);

const editorRef = ref(null);

const editorInitOptions = {
  toolbar_mode: "sliding",
  toolbar:
    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
  tinycomments_mode: "embedded",
  tinycomments_author: "Author name",
  // AI request con Promise correctamente manejado
  /* ai_request: (request: any, respondWith: any) => {
    return respondWith.string(() =>
      Promise.reject("See docs to implement AI Assistant")
    );
  }, */
};

const df = new DateFormatter("en-US", {
  dateStyle: "long",
});

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

const startDate = computed({
  get: () => (values.startDate ? parseDate(values.startDate) : undefined),
  set: (val) => val,
});

const endDate = computed({
  get: () => (values.endDate ? parseDate(values.endDate) : undefined),
  set: (val) => val,
});

const { handleSubmit, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {},
});

const onSubmit = handleSubmit(async (values) => {
  await uploadImage();

  emits("onSubmit", { form: values, cover: imageUrl.value });

  /* await useEvents.createEvent({
    description: editorContent.value || values.description!,
    name: values.name!,
    startDate: new Date(values.startDate),
    endDate: new Date(values.endDate),
    eventType: values.eventType!,
    isPublic: values.isPublic!,
    userId: props.userId,
    status: "upcoming",
    waypoints: [],
  }); */

  setCurrentStepCreateEvent(2);
});

const picture = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const uploadError = ref<string | null>(null);

// Crear instancia de Cloudinary
const cloudName = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
const cld = new Cloudinary({
  cloud: {
    cloudName: cloudName, // Leer cloudName desde las variables de entorno
  },
});

const uploadImage = async () => {
  if (!picture.value) return;

  const formData = new FormData();
  formData.append("file", picture.value);
  formData.append("upload_preset", "ml_default"); // Cambia esto por tu propio upload_preset

  try {
    // Usamos fetch para realizar la subida de imagen
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();

    // Muestra la URL de la imagen subida
    //imageUrl.value = data.secure_url;

    if (response.ok) {
      // Si la subida fue exitosa, aplicar la transformación
      const uploadedImage = cld.image(data.public_id);

      // Aplicar transformación c_fit (redimensionar con ajuste de proporciones)
      const transformedImage = uploadedImage.resize(
        fill().width(600).height(300) // Aquí defines el tamaño exacto
      );

      imageUrl.value = transformedImage.toURL();
      console.log("Imagen subida y transformada:", imageUrl.value);
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    uploadError.value = "Error al subir la imagen: " + error;
  }
};

const selectGradient = (gradient: any) => {
  emits("setGradient", gradient);
};
</script>

<template>
  <form @submit.prevent="onSubmit" autocomplete="off" class="space-y-4">
    <div class="flex flex-col md:flex-row gap-4 md:gap-8">
      <!-- Nombre del Evento -->
      <div class="flex flex-col md:w-4/6">
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
                  <SelectValue placeholder="Selecciona tu tipo de evento" />
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
    </div>

    <!-- Fecha de Inicio y Fecha de Término -->
    <div class="flex flex-col md:flex-row gap-4 md:gap-8">
      <!-- Fecha de Inicio -->
      <div class="flex flex-col md:w-3/12">
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
                        'w-full text-start font-light !bg-input border border-gray-500 border-gray-500',
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
      <div class="flex flex-col md:w-3/12">
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
                        'w-full text-start font-light !bg-input border border-gray-500',
                        !endDate && 'text-muted-foreground'
                      )
                    "
                  >
                    <span>{{
                      endDate ? df.format(toDate(endDate)) : "Seleccionar fecha"
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

      <!-- Evento Público -->
      <div class="flex flex-col align-top">
        <FormField v-slot="{ componentField }" name="isPublic">
          <FormItem v-auto-animate class="space-y-0">
            <FormLabel class="align-top">¿Es Público?</FormLabel>
            <div class="flex items-start justify-center align-top">
              <FormControl>
                <Switch
                  class="border dark:border-slate-700 border-gray-500"
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
    <div class="flex flex-col md:w-6/6">
      <FormField v-slot="{ componentField }" name="description">
        <FormItem v-auto-animate>
          <FormLabel>Descripción</FormLabel>
          <FormControl>
            <div class="flex flex-col align-top">
              <FormField
                v-slot="{ componentField }"
                name="isPublic"
                v-if="false"
              >
                <FormItem v-auto-animate class="space-y-0">
                  <FormLabel class="flex align-top justify-end text-sm"
                    >¿Mostrar modo avanzado?</FormLabel
                  >
                  <div class="flex items-start justify-end align-top">
                    <FormControl>
                      <Switch
                        class="border dark:border-slate-700"
                        v-model:checked="turnTinyMceIntoEditor"
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div v-if="turnTinyMceIntoEditor">
              <Editor
                class="!border-dashed !border-2 !border-gray-200"
                v-model="editorContent"
                ref="editorRef"
                api-key="m6yhshx15n7lh6omdjuk895p413v1t8eeelyzhr6ujgcmgei"
                :init="editorInitOptions"
                initial-value=""
              />
            </div>
            <div v-else>
              <Textarea
                rows="10"
                placeholder="Descripción del evento (opcional, mín. 2 caracteres, máx. 500)."
                class="resize-none"
                v-bind="componentField"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>
    </div>

    <!-- Subir imagen -->
    <div class="flex flex-col md:flex-row gap-4 md:gap-8">
      <div class="flex flex-col md:w-3/6">
        <FormField v-slot="{ componentField }" name="cover">
          <FormItem v-auto-animate>
            <FormLabel>Imagen de portada</FormLabel>
            <FormControl>
              <Input
                id="picture"
                type="file"
                v-bind="componentField"
                @change="(e: any) => picture = e.target.files[0]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="flex flex-col md:w-3/6">
        <FormField v-slot="{ componentField }" name="cover">
          <FormItem v-auto-animate>
            <FormLabel>O selecciona un color</FormLabel>
            <FormControl>
              <div
                class="flex flex-row gap-x-4 gap-y-4 border border-gray-500 rounded-sm p-2 bg-input pr-2 pl-4 pt-2 pb-2" 
              >
                <button
                  v-for="(gradient, index) in props.gradients"
                  :key="index"
                  :class="[
                    gradient,
                    'p-2 text-white font-light rounded-full text-sm w-[24px] h-[24px]',
                  ]"
                  @click.prevent="selectGradient(gradient)"
                ></button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>
    </div>

    <div class="flex flex-col items-end py-4">
      <Button type="submit" class="w-2/6" :disabled="!loading"
        >Continuar</Button
      >
    </div>
  </form>
</template>
