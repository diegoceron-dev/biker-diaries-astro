<script setup lang="ts">
import { typeEventCatalog } from "@/store/catalogs";
import { useStore } from "@nanostores/vue";
import { computed, onMounted, ref, onBeforeUnmount, reactive } from "vue";
import DataGeneral from "@/components/vue/events/create/form/DataGeneral.vue";
import Locations from "@/components/vue/events/create/form/Locations.vue";
import { vAutoAnimate } from "@formkit/auto-animate/vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSteppers } from "@/composables/useSteppers";

onBeforeUnmount(() => {});

const props = defineProps({
  userId: String,
});

const { currentStepCreateEvent, setCurrentStepCreateEvent } = useSteppers(); // Usa el estado global

onMounted(() => {});

const cover = ref("");

const onSubmit = (data: { form: any; cover: string }) => {
  console.log("Form Submitted: ", data);
  cover.value = data.cover;
};

const computedClass = computed(() => {
  /*  const bgDefault =
    "https://images.unsplash.com/photo-1558979159-2b18a4070a87?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
 
 */

  const bgDefault = "https://images.unsplash.com/photo-1518057014654-ba829c396280?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  return `h-[150px] relative bg-cover bg-center ${
    cover.value ? `bg-[url('${cover.value}')]` : `bg-[url('https://images.unsplash.com/photo-1518057014654-ba829c396280?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]`
  }`;
});
</script>

<template>
  <div class="flex flex-col" v-auto-animate>
    <div :class="computedClass"></div>
    <div class="w-full px-[12%] py-8">
      <DataGeneral
        v-if="currentStepCreateEvent === 1"
        :userId="userId"
        @onSubmit="onSubmit"
      />
      <Locations v-if="currentStepCreateEvent === 2" :userId="userId" />
    </div>
    <!--  </CardContent>
    </Card> -->
  </div>
</template>
