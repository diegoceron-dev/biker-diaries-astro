<script setup>
import { ref } from "vue";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ClipboardEdit, ClipboardX } from "lucide-vue-next";

const emits = defineEmits(['cancel', 'modify']);

const disabled = ref(false);

const modify = () => {
  emits('modify')
}

const cancel = () => {
  console.log('cancel dropdown')
  emits('cancel');
} 
</script>

<template>
  <DropdownMenu class="cursor-pointer">
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        size="icon"
        :disabled="disabled"
        class="cursor-pointer"
      >
        <MoreHorizontal class="size-4" />
        <span class="sr-only">More</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="cursor-pointer">
      <DropdownMenuItem class="cursor-pointer"
        ><ClipboardEdit class="size-4" /> <span class="pl-2" @click="modify">Modificar</span>
      </DropdownMenuItem>
      <DropdownMenuItem class="cursor-pointer"
        ><ClipboardX class="size-4" /> <span class="pl-2" @click="cancel">Cancelar</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<style scoped>
/* Agrega estilos específicos para este componente si es necesario */
</style>
