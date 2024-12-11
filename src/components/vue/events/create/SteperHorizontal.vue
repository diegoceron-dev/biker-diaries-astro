<script setup lang="ts">
import { Stepper, StepperDescription, StepperIndicator, StepperItem, StepperSeparator, StepperTitle, StepperTrigger } from '@/components/ui/stepper'

import { Waypoints, Settings, CreditCard, Ticket } from 'lucide-vue-next'

const steps = [{
  step: 1,
  title: 'General',
  description: 'Completa los datos generales del evento',
  icon: Settings,
}, {
  step: 2,
  title: 'Ubicaciones',
  description: 'Agrega las ubicaciones donde se llevará a cabo el evento',
  icon: Waypoints,
}, {
  step: 3,
  title: 'Acceso',
  description: 'Configura el acceso de los asistentes',
  icon: Ticket,
},
{
  step:4,
  title: 'Pagos',
  description: 'Configuracion de métodos de pago y tarifas', 
  icon: CreditCard,
}]
</script>

<template>
  <Stepper>
    <StepperItem
      v-for="item in steps"
      :key="item.step"
      class="basis-1/4"
      :step="item.step"
    >
      <StepperTrigger>
        <StepperIndicator>
          <component :is="item.icon" class="w-7 h-7" />
        </StepperIndicator>
        <div class="flex flex-col">
          <StepperTitle>
            {{ item.title }}
          </StepperTitle>
          <StepperDescription>
            {{ item.description }}
          </StepperDescription>
        </div>
      </StepperTrigger>
      <StepperSeparator
        v-if="item.step !== steps[steps.length - 1].step"
        class="w-full h-px"
      />
    </StepperItem>
  </Stepper>
</template>