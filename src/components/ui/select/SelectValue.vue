<script setup lang="ts">
import { SelectValue, type SelectValueProps } from 'radix-vue'

const props = defineProps<SelectValueProps>()
</script>

<template>
  <SelectValue v-bind="props" class="text-red">
    <slot />
  </SelectValue>
</template>
