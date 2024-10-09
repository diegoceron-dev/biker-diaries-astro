<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input"; // Componente Input de ShadCN
import { Label } from "@/components/ui/label"; // Componente Label de ShadCN

// Estado para la imagen seleccionada y la URL subida
const picture = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const uploadError = ref<string | null>(null);

// Función para manejar la subida de imagen usando fetch y Cloudinary
const uploadImage = async () => {
  if (!picture.value) return;

  const formData = new FormData();
  formData.append("file", picture.value);
  formData.append("upload_preset", "ml_default"); // Cambia esto por tu propio upload_preset

  try {
    // Usamos fetch para realizar la subida de imagen
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await response.json();

    // Muestra la URL de la imagen subida
    imageUrl.value = data.secure_url;
    console.log("Imagen subida:", data.secure_url);
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    uploadError.value = "Error al subir la imagen: " + error;
  }
};
</script>

<template>
  <div class="grid w-full max-w-sm items-center gap-2">
    <Label for="picture">Sube una imagen</Label>
    <Input
      id="picture"
      type="file"
      @change="(e: any) => picture = e.target.files[0]"
    />

    <button
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      @click.prevent="uploadImage"
    >
      Subir Imagen
    </button>

    <!-- Mostrar la imagen subida -->
    <div v-if="imageUrl" class="mt-4">
      <p>Imagen subida correctamente:</p>
      <img
        :src="imageUrl"
        alt="Imagen subida"
        class="mt-2 max-w-full h-auto rounded-md"
      />
    </div>

    <!-- Mostrar error si ocurre -->
    <div v-if="uploadError" class="mt-4 text-red-500">
      {{ uploadError }}
    </div>
  </div>
</template>
