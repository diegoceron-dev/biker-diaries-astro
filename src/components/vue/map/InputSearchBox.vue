<template>
  <div>
    <input
      ref="searchInput"
      type="text"
      v-model="query"
      placeholder="Busca una ubicación"
    />
    <ul v-if="results.length">
      <li v-for="result in results" :key="result.id">
        {{ result.place_name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { MapboxSearchBox } from "@mapbox/search-js-web";

export default {
  data() {
    return {
      query: "",
      results: [],
      searchBox: null,
    };
  },
  mounted() {
    const searchInput = this.$refs.searchInput;

    if (searchInput) {
      this.searchBox = new MapboxSearchBox({
        accessToken: "pk.eyJ1IjoiZGllZ29jZXJvbmRldiIsImEiOiJjbDBxNWY5OWcwOWMyM2NxbmFyNjN0cm51In0.gEWz2YRkQypcE52QUIErIA",
        container: searchInput, // Asigna correctamente el input como container
      });

      // Escucha los eventos de resultados que dispara automáticamente MapboxSearchBox
      this.searchBox.addEventListener("results", (event) => {
        if (event.results) {
          this.results = event.results; // Asigna los resultados al estado
        }
      });

      this.searchBox.addEventListener("error", (error) => {
        console.error("Error en la búsqueda:", error);
      });
    } else {
      console.error("El input de búsqueda no se encontró.");
    }
  },
  watch: {
    query(newQuery) {
      // Solo realizaremos la búsqueda si hay al menos 3 caracteres
      if (newQuery.length < 3) {
        this.results = []; // Limpia los resultados si el texto es muy corto
      }
    },
  },
};
</script>
