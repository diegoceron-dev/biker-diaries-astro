<script setup lang="ts">
import { onMounted } from "vue";
import { useColorMode } from "@vueuse/core";
import { Button } from "@/components/ui/button";

import { MoonStarIcon, Sun } from "lucide-vue-next";

const mode = useColorMode();

const toggleTheme = () => {
  if (mode.value === "dark") {
    mode.value = "light";
    return;
  }

  mode.value = "dark";
  return;
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" @click="toggleTheme" class="p-0 m-0 w-[40px]">
        <MoonStarIcon v-if="mode == 'light'" />
        <Sun v-if="mode == 'dark'" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
  </DropdownMenu>
</template>
