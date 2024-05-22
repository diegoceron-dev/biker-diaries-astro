<template>
  <Carousel :autoplay="3000" :wrap-around="true">
    <Slide v-for="slide in images" :key="slide">
      <div class="carousel__item">
        <img :src="slide" />
      </div>
    </Slide>
    <template #addons>
      <Navigation />
      <!-- <Pagination /> -->
    </template>
  </Carousel>
</template>

<script lang="ts" setup>
// import { defineProps, withDefaults } from "vue";
import { Carousel, Navigation, Pagination, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

/* const props = defineProps({
  images: {
    type: Array<string>,
    required: true
  }
}); */

// const { images } = props;
const images: Array<string> = [
  "https://images.unsplash.com/photo-1609204276470-d22da7d40a3c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1558980664-2cd663cf8dde?q=80&w=2940",
  "https://images.unsplash.com/photo-1558980664-3a031cf67ea8?q=80&w=2940",
  "https://images.unsplash.com/photo-1568900311962-66498d9e9daf?q=80&w=2940",
  "https://images.unsplash.com/photo-1517661418392-9578e91273a5?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1549636367-13c144c47063?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];
</script>

<style>
.carousel__item {
  max-height: 300px !important;
  width: 100%;
  background-color: transparent;
  color: white;
  font-size: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel__slide {
  padding: 0;
}


.carousel__prev,
.carousel__next {
  color: white;
}
</style>
