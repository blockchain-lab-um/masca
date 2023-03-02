<template>
  <div class="didSelector">
    <Dropdown
      v-if="mmStore.snapInstalled"
      v-model="mmStore.currDIDMethod"
      :options="mmStore.availableMethods"
      @change="changeDIDMethod(undefined, $event)"
      optionLabel="text"
      :loading="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { useGeneralStore } from '@/stores/general';
import { useMetamaskStore } from '@/stores/metamask';
import { createDIDMethod } from '@/util/snap';
import type { AvailableMethods } from '@blockchain-lab-um/ssi-snap-types';
import type { ToastServiceMethods } from 'primevue/toastservice';
import { ref } from 'vue';

const mmStore = useMetamaskStore();
const generalStore = useGeneralStore();
const toast = generalStore.toast as ToastServiceMethods;
const isLoading = ref(false);

const changeDIDMethod = async (method?: string, event?: any) => {
  try {
    if (event.value.value === mmStore?.didMethodString) return;
    if (!method) method = mmStore.currDIDMethod?.value;
    if (!method) throw new Error('No method selected');
    isLoading.value = true;
    const res = await mmStore.snapApi?.switchDIDMethod(
      method as AvailableMethods
    );
    if (res) {
      const did = await mmStore.snapApi?.getDID();
      if (did) mmStore.DID = did;
      isLoading.value = false;
      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Success changing DID method.',
        group: 'br',
        life: 3000,
      });
      // console.log('Success changing DID method.');
      return;
    }
    mmStore.currDIDMethod = createDIDMethod(mmStore.didMethodString);
    throw new Error('Failed to change DID method');
  } catch (error: any) {
    isLoading.value = false;
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
</script>

<style scoped>
.didSelector {
  display: flex;
  align-items: center;
}
</style>
