<template>
  <div class="settings">
    <h1 id="title">SSI Snap Configuration</h1>
    <div class="settingsContent">
      <div class="center">
        <p>Enable Ceramic Network:</p>
        <div>
          <InputSwitch v-model="mmStore.useCeramic" @input="toggleCeramic" />
        </div>
      </div>

      <div class="center">
        <p>Used for toggling the built-in Metamask popups:</p>
        <wrappedButton
          id="togglePopups"
          label="Toggle popups"
          :method="togglePopups"
          class="p-button-rounded"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGeneralStore } from '@/stores/general';
import { useMetamaskStore } from '@/stores/metamask';
import { setVCStore } from '@/util/snap';
import type InputText from 'primevue/inputtext';
import type { ToastServiceMethods } from 'primevue/toastservice';

import wrappedButton from '@/components/wrappedButton.vue';

const mmStore = useMetamaskStore();
const generalStore = useGeneralStore();
const toast = generalStore.toast as ToastServiceMethods;

const toggleCeramic = async (val: boolean) => {
  try {
    const res = await setVCStore('ceramic', val, mmStore.snapApi);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: res,
      group: 'br',
      life: 3000,
    });
  } catch (error: any) {
    mmStore.currVCStore = { snap: true, ceramic: false };
    mmStore.useCeramic = !val;
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      group: 'br',
      life: 3000,
    });
  }
};

const togglePopups = async () => {
  const res = await mmStore.snapApi?.togglePopups();
  if (!res) throw new Error('Failed to toggle popups');
  return 'Success toggling popups.';
};
</script>

<style lang="scss" scoped>
.settings {
  margin: 0 auto;
  max-width: 1000px;
}

.settingsContent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.settingsContent * {
  margin: 0.5rem 1rem;
}

.center {
  display: flex;
  align-items: center;
}
</style>
