<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="
      cn(
        'rounded-md border border-slate-400 text-card-foreground shadow-md bg-card',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
