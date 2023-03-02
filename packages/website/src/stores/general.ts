import { defineStore } from 'pinia';
import type { ToastServiceMethods } from 'primevue/toastservice';
import { ref } from 'vue';

export const useGeneralStore = defineStore('general', () => {
  // Store values
  const toast = ref<ToastServiceMethods>();
  const courseStarted = ref<boolean>(false);

  return {
    toast,
    courseStarted,
  };
});
