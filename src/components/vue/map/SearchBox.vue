<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  autofill,
  MapboxAddressMinimap,
  config,
  confirmAddress,
} from "@mapbox/search-js-web";
import type { AddressAutofillCollectionType } from "@mapbox/search-js-web/dist/autofill";

const ACCESS_TOKEN =
  "pk.eyJ1IjoiZGllZ29jZXJvbmRldiIsImEiOiJjbDBxNWY5OWcwOWMyM2NxbmFyNjN0cm51In0.gEWz2YRkQypcE52QUIErIA";

const autofillCollection = ref<AddressAutofillCollectionType | null>(null);
const minimap = ref<MapboxAddressMinimap | null>(null);
const minimapContainer = document.getElementById(
  "minimap-container"
) as HTMLElement;
const validationMsg = ref(null);
const form = ref(null);

onMounted(() => {
  config.accessToken = ACCESS_TOKEN;

  autofillCollection.value = autofill({});

  minimap.value = new MapboxAddressMinimap();
  minimap.value.canAdjustMarker = true;
  minimap.value.satelliteToggle = true;
  minimap.value.onSaveMarkerLocation = (lnglat) => {
    console.log(`Marker moved to ${lnglat}`);
  };

  if (minimapContainer) {
    minimapContainer.appendChild(minimap.value);
  }

  autofillCollection.value.addEventListener("retrieve", async (e) => {
    expandForm();
    if (minimap.value) {
      minimap.value.feature = e.detail.features[0];
      showMap();
    }
  });
});

function showMap() {
  const el = minimapContainer;
  if (el) el.classList.remove("none");
}

function hideMap() {
  const el = minimapContainer;
  if (el) el.classList.add("none");
}

function expandForm() {
  const manualEntry = document.getElementById("manual-entry");
  const secondaryInputs = document.querySelector(".secondary-inputs");
  const submitBtns = document.querySelector(".submit-btns");

  if (manualEntry) manualEntry.classList.add("hide");
  if (secondaryInputs) secondaryInputs.classList.remove("hide");
  if (submitBtns) submitBtns.classList.remove("hide");
}

function collapseForm() {
  const manualEntry = document.getElementById("manual-entry");
  const secondaryInputs = document.querySelector(".secondary-inputs");
  const submitBtns = document.querySelector(".submit-btns");

  if (manualEntry) manualEntry.classList.remove("hide");
  if (secondaryInputs) secondaryInputs.classList.add("hide");
  if (submitBtns) submitBtns.classList.add("hide");
}

function setValidationText(color: string, msg: string, clear = false) {
  const el = document.getElementById("minimap-container");
  if (clear && el) el.classList.add("none");
  if (el) {
    el.classList.remove("color-green", "color-red");
    el.classList.add(`color-${color}`);
    el.innerText = msg;
    el.classList.remove("none");
  }
}

function submitForm() {
  setValidationText("green", "Order successfully submitted.");
  setTimeout(() => {
    resetForm();
  }, 2500);
}

function resetForm() {
  const form = document.querySelector("form");
  if (form && form.value) {
    const inputs = form.value?.querySelectorAll("input");
    inputs?.forEach((input: any) => (input.value = ""));
    collapseForm();
    setValidationText("green", "", true);
    autofillCollection.value!.update();
    if (minimap.value) minimap.value.feature = null;
  }
}

async function onSubmit() {
  const result = await confirmAddress(form.value!, {
    minimap: true,
    skipConfirmModal: (feature) =>
      ["exact", "high"].includes(feature.properties.match_code.confidence),
  });
  if (result.type === "nochange") submitForm();
}
</script>

<template>
  <div class="flex flex-row">
    <form
      class="flex flex--column"
      onsubmit="event.preventDefault();"
      autocomplete="off"
    >
      <div class="grid grid--gut24 mb60">
        <div class="col col--auto-mm w-full">
          <!-- Input form -->
          <label class="txt-s txt-bold color-gray mb3">Address</label>
          <input
            class="input mb12"
            placeholder="Start typing your address, e.g. 123 Main..."
            autocomplete="address-line1"
            id="mapbox-autofill"
          />
          <div
            id="manual-entry"
            class="w180 mt6 link txt-ms border-b color-gray color-black-on-hover"
          >
            Enter an address manually
          </div>
          <div class="secondary-inputs hide">
            <label class="txt-s txt-bold color-gray mb3">Address Line 2</label>
            <input
              class="input mb12"
              placeholder="Apartment, suite, unit, building, floor, etc."
              autocomplete="address-line2"
            />
            <label class="txt-s txt-bold color-gray mb3">City</label>
            <input
              class="input mb12"
              placeholder="City"
              autocomplete="address-level2"
            />
            <label class="txt-s txt-bold color-gray mb3">State / Region</label>
            <input
              class="input mb12"
              placeholder="State / Region"
              autocomplete="address-level1"
            />
            <label class="txt-s txt-bold color-gray mb3">ZIP / Postcode</label>
            <input
              class="input"
              placeholder="ZIP / Postcode"
              autocomplete="postal-code"
            />
          </div>
        </div>
        <div class="col col--auto-mm">
          <!-- Visual confirmation map -->
          <div
            id="minimap-container"
            class="none h240 w360 relative mt18"
          ></div>
        </div>
      </div>

      <!-- Form buttons -->
      <div class="mb30 submit-btns hide">
        <button type="submit" class="btn round" id="btn-confirm">
          Confirm
        </button>
        <button type="button" class="btn round btn--gray-light" id="btn-reset">
          Reset
        </button>
      </div>
    </form>

    <div id="validation-msg" class="mt24 txt-m txt-bold none">Test</div>
  </div>
</template>

<style scoped>
.hide {
  display: none;
}
</style>
