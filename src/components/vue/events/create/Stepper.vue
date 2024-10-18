<script setup lang="ts">
import { Check, Circle, Dot, CircleCheckBig } from "lucide-vue-next";
import { ref, computed } from "vue";
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { useSteppers } from "@/composables/useSteppers"; // Importa el composable que maneja el estado

const { currentStepCreateEvent, setCurrentStepCreateEvent } = useSteppers(); // Usa el estado global

const steps = [
  {
    step: 1,
    id: "general",
    title: "Datos generales",
    description:
      "Provide your name and email address. We will use this information to create your account",
    show: true,
  },
  {
    step: 2,
    id: "locations",
    title: "Ubicaciones",
    description:
      "A few details about your company will help us personalize your experience",
    show: true,
  },
  {
    step: 3,
    id: "agenda",
    title: "Agenda",
    description:
      "Start collaborating with your team by inviting them to join your account. You can skip this step and invite them later",
    show: false,
  },
  {
    step: 4,
    id: "tickets",
    title: "Tickets",
    description:
      "A few details about your company will help us personalize your experience",
    show: false,
  },
  {
    step: 5,
    id: "share",
    title: "Compatir",
    description:
      "Start collaborating with your team by inviting them to join your account. You can skip this step and invite them later",
    show: false,
  },
];

const setNewStep = (step: number) => {
  if (step < currentStepCreateEvent.value) setCurrentStepCreateEvent(step);
  return;
};

const visibleStepsCount = computed(() => steps.filter(step => step.show).length);

</script>

<template>
  <Stepper
    orientation="vertical"
    class="mx-auto flex max-w-md flex-col justify-start gap-y-10"
    v-model="currentStepCreateEvent"
  >
    <StepperItem
      v-for="(step, index) in steps"
      v-show="step?.show"
      :key="index"
      v-slot="{ state }"
      class="relative flex w-full items-start gap-6"
      :step="index + 1"
      @click="setNewStep(index + 1)"
    >
      <StepperSeparator
      v-if="index + 1 !== visibleStepsCount"
      class="absolute left-[18px] top-[38px] block h-[105%] w-1 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
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
          <CircleCheckBig v-if="state === 'completed'" />
          <Circle v-if="state === 'active'" />
          <Dot v-if="state === 'inactive'" />
        </Button>
      </StepperTrigger>

      <div class="flex flex-col gap-1">
        <StepperTitle
          :class="[state === 'active' && '!text-primary']"
          class="text-sm font-light transition lg:text-base text-slate-600"
        >
          {{ step.title }}
        </StepperTitle>
        <StepperDescription
          :class="[state === 'active' && 'text-primary']"
          class="sr-only text-xs text-slate-600 transition md:not-sr-only lg:text-sm"
        >
          {{ step.description }}
        </StepperDescription>
      </div>
    </StepperItem>
  </Stepper>
</template>
