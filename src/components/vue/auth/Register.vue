<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const { toast } = useToast();

const goToGithubAPI = () => {
  window.location.href = "api/auth/github";
};

const goToHome = () => {
  window.location.href = "/";
};

const email = ref("");
const password = ref("");

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  const formData = new FormData();

  formData.append("email", email.value);
  formData.append("password", password.value);

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: formData,
    });

    console.log(response);

    if (response.ok) {
      const successText = await response.text();

      toast({
        description: successText,
        variant: "default",
      });

      goToHome();
    } else {
      alert("error");
      const errorText = await response.text();
      console.log(response);

      toast({
        title: "¡Uh oh! Algo ha salido mal.",
        description: errorText,
        variant: "destructive",
      });
    }
  } catch (error: any) {
    console.log(error);
    toast({
      title: "¡Uh oh! Algo ha salido mal.",
      description: error.toString(),
      variant: "destructive",
    });
  }
};
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Registro</CardTitle>
      <CardDescription>Regístrese en su cuenta</CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit="handleSubmit" class="space-y-4 md:space-y-6">
        <div>
          <label
            for="email"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Correo</label
          >
          <input
            type="text"
            name="email"
            id="email"
            v-model="email"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required="true"
          />
        </div>
        <div>
          <label
            for="password"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >Contraseña</label
          >
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            v-model="password"
            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required="true"
          />
        </div>

        <button
          type="submit"
          class="w-full text-white bg-primary focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Registrarme
        </button>
      </form>
      <div class="pt-4">
        <button
          @click="goToGithubAPI"
          class="w-full text-black bg-slate-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          Registrarme con Github
        </button>
      </div>
    </CardContent>
    <CardFooter>
      <p class="text-sm font-light text-gray-500 dark:text-gray-400">
        Ya tiene una cuenta?
        <a
          href="/signin"
          class="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >Entrar</a
        >
      </p>
    </CardFooter>
  </Card>
</template>
