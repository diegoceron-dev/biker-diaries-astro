<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr :class="cn('border-b border-slate-200 transition-colors hover:bg-secondary/10 data-[state=selected]:bg-muted/10 text-foreground/70', props.class)">
    <slot />
  </tr>
</template>
