<script setup lang="ts">
import { onMounted, ref } from "vue";
import { MapboxAddressAutofill } from "@mapbox/search-js-web";

const form = ref<HTMLFormElement | null>(null);
const addressInput = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (form.value && addressInput.value) {
    const autofillElement = new MapboxAddressAutofill();

    autofillElement.accessToken =
      "pk.eyJ1IjoiZGllZ29jZXJvbmRldiIsImEiOiJjbDBxNWY5OWcwOWMyM2NxbmFyNjN0cm51In0.gEWz2YRkQypcE52QUIErIA";

    autofillElement.options = { country: "mx" };

    // Reemplazar el input de dirección por el elemento autofill
    addressInput.value.parentNode?.replaceChild(
      autofillElement as unknown as Node,
      addressInput.value
    );

    autofillElement.appendChild(addressInput.value);

    const the_input = document.getElementById("address-input");

    const the_form = the_input!.parentElement;

    autofillElement.appendChild(the_input!);

    // the_form!.appendChild(autofillElement as any);

  }
});
</script>

<template>
  <div class="h-[300px] flex flex-col">
    <form ref="form" onsubmit="event.preventDefault();" autocomplete="off">
      <input
        class="border border-primary"
        ref="addressInput"
        id="address-input"
        type="text"
        name="address"
      />
      <!--       <input type="text" name="address-1" autocomplete="address-line1" />
      <input type="text" name="address-2" autocomplete="address-line2" />
      <input type="text" name="city" autocomplete="address-level2" />
      <input type="text" name="state" autocomplete="address-level1" />
      <input type="text" name="zip" autocomplete="postal-code" /> -->
    </form>
  </div>
</template>
