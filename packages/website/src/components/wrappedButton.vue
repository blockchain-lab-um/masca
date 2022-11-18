<template>
  <pButton
    :label="label"
    :loading="isLoading.value"
    v-if="condition"
    @click="funcWrapper(toast, method, isLoading)"
    :class="cssClass"
    :icon="icon"
  />
</template>
  
<script setup lang="ts">
import { reactive } from 'vue';
import { useGeneralStore } from '@/stores/general';
import { funcWrapper } from '@/util/general';
import type { ToastServiceMethods } from 'primevue/toastservice';

defineProps({
  method: {
    type: Function,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  condition: {
    required: false,
    default: true,
  },
  cssClass: {
    type: String,
    required: false,
  },
  icon: {
    type: String,
    required: false,
  },
});

const generalStore = useGeneralStore();
const toast = generalStore.toast as ToastServiceMethods;

let isLoading = reactive({ value: false });
</script>

<style scoped></style>
