<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <tr :class="cn('border-b border-slate-200 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted text-muted-foreground', props.class)">
    <slot />
  </tr>
</template>
