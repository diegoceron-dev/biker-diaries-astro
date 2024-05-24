<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import type { APIContext } from "astro";

const { toast } = useToast();

const getData = async () => {
  const response = await fetch("/api/catalogs/getCatalog", {
    method: "GET",
  });

  const data = await response.json();
  console.log(data);
};

onMounted(() => {
  getData();
});

const goToCreateEvent = async () => {
  // window.location.href = "/events/create";
};
</script>

<template>
  <div>
    <div class="flex flex-col space-y-4 py-12 px-24">
      <div class="flex flex-row justify-between">
        <p class="text-3xl text-gray-600">Mis Eventos</p>
        <div>
          <a href="/events/create">
            <button
              class="w-full text-white bg-secondary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transform transition duration-500 hover:scale-110 cursor-pointer"
            >
              Crear nuevo evento
            </button>
          </a>
        </div>
      </div>
      <div class="flex flex-col border-gray-200 border-2 rounded-xl py-4 px-8">
        <div class="text-gray-400 md:h-[400px]">Sin eventos</div>
      </div>
    </div>
  </div>
</template>
