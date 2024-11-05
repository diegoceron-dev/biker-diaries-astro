<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Button from "@/components/ui/button/Button.vue";
import { LogOut, UserCog2Icon, Home, Menu } from "lucide-vue-next";


async function logout() {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
    });

    const data = await response.json();

    if (data.clearLocalStorage) localStorage.clear();

    window.location.href = "/";
  }
</script>

<template>
  <Sheet>
    <SheetTrigger>
      <Button
        variant="outline"
        size="icon"
        class="bg-transparent transition duration-300 ease-in-out transform hover:scale-110 hover:text-secondary-foreground"
      >
        <Menu class="text-white" />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Menu</SheetTitle>
        <SheetDescription>
          <!-- Icono de Home -->
          <div class="w-full mb-2">
            <form method="POST" action="/">
              <Button
                variant="outline"
                class="w-full flex items-center justify-start gap-2 bg-transparent border-secondary-foreground text-black hover:text-secondary-foreground transition duration-300 ease-in-out transform hover:scale-105"
              >
                <Home class="text-black" />
                <span>Ir al inicio</span>
              </Button>
            </form>
          </div>

          <!-- Icono de Usuario (perfil) -->
          <div class="w-full mb-2">
            <form method="POST" action="/profile">
              <Button
                variant="outline"
                class="w-full flex items-center justify-start gap-2 bg-transparent border-secondary-foreground text-black hover:text-secondary-foreground transition duration-300 ease-in-out transform hover:scale-105"
              >
                <UserCog2Icon class="text-black" />
                <span>Ver mi perfil</span>
              </Button>
            </form>
          </div>

          <!-- Icono de Logout -->
          <div class="w-full">
            <div id="alert">
              <Button
                variant="outline"
                class="w-full flex items-center justify-start gap-2 bg-transparent border-secondary-foreground text-black hover:text-secondary-foreground transition duration-300 ease-in-out transform hover:scale-105"
                @click="logout"
                >
                <LogOut class="text-black" />
                <span>Salir de la aplicación</span>
              </Button>
            </div>
          </div>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>
