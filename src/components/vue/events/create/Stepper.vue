<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";

import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Check, Circle, Dot } from "lucide-vue-next";
import { useSteppers } from "@/composables/useSteppers"; // Importa el composable que maneja el estado

const { currentStepCreateEvent, setCurrentStepCreateEvent } = useSteppers(); // Usa el estado global

const steps = [
  {
    step: 1,
    id: "general",
    title: "Datos generales",
    description:
      "Completa los datos básicos del evento, como el nombre, fecha de inicio y término, y tipo de evento.",
    show: true,
  },
  {
    step: 2,
    id: "locations",
    title: "Ubicaciones",
    description:
      "Añade las ubicaciones donde se llevará a cabo el evento. Puedes incluir una o más direcciones.",
    show: true,
  },
  /*   {
    step: 3,
    id: "agenda",
    title: "Agenda",
    description:
      "Configura la agenda del evento, incluyendo horarios y actividades específicas que se realizarán.",
    show: false,
  },
  {
    step: 4,
    id: "tickets",
    title: "Tickets",
    description:
      "Define el tipo de boletos para tu evento, precios y opciones de compra para los asistentes.",
    show: false,
  }, */
  {
    step: 5,
    id: "share",
    title: "Compartir",
    description:
      "Comparte tu evento con los asistentes a través de redes sociales o invitaciones personalizadas.",
    show: true,
  },
];

const setNewStep = (step: number) => {
  if (step < currentStepCreateEvent.value) setCurrentStepCreateEvent(step);
  return;
};

const visibleStepsCount = computed(
  () => steps.filter((step) => step.show).length
);
</script>

<template>
  <Stepper
    orientation="vertical"
    class="mx-auto flex w-full max-w-md flex-col justify-start gap-10"
    v-model="currentStepCreateEvent"
  >
    <StepperItem
      v-for="(step, index) in steps"
      :key="step.step"
      v-slot="{ state }"
      class="relative flex w-full items-start gap-6"
      :step="step.step"
      @click="setNewStep(index + 1)"
    >
      <StepperSeparator
        v-if="step.step !== steps[steps.length - 1].step"
        class="absolute left-[18px] top-[38px] block h-[105%] w-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
      />

      <StepperTrigger as-child>
        <Button
          :variant="
            state === 'completed' || state === 'active'
              ? 'default'
              : 'secondary'
          "
          size="icon"
          class="z-10 rounded-full shrink-0"
          :class="[
            state === 'active' &&
              'ring-2 ring-ring ring-offset-2 ring-offset-background',
          ]"
        >
          <Check v-if="state === 'completed'" class="size-5" />
          <Circle v-if="state === 'active'" />
          <Dot v-if="state === 'inactive'" />
        </Button>
      </StepperTrigger>

      <div class="flex flex-col gap-1">
        <StepperTitle
          :class="[state === 'active' && 'text-primary']"
          class="text-sm font-semibold transition lg:text-base"
        >
          {{ step.title }}
        </StepperTitle>
        <StepperDescription
          :class="[state === 'active' && 'text-primary']"
          class="text-xs text-muted-foreground transition md:not-sr-only lg:text-sm"
        >
          {{ step.description }}
        </StepperDescription>
      </div>
    </StepperItem>
  </Stepper>
</template>
