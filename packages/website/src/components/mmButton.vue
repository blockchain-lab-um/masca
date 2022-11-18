<template>
  <Button
    label="Connect MetaMask"
    :loading="isLoading"
    v-if="!mmStore.snapInstalled"
    @click="connectToMM()"
  />
  <div
    v-if="mmStore.snapInstalled"
    style="display: flex; flex-direction: column"
  >
    <Chip
      :label="mmStore.didString"
      icon="pi pi-check"
      class="p-mr-2"
      @click="copyToClipboard('did')"
    />
    <Chip
      :label="mmStore.mmAddressString"
      icon="pi pi-check"
      class="p-mr-2"
      @click="copyToClipboard('mmAddr')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { installSnap, initStore } from '../util/snap';
import { useMetamaskStore } from '@/stores/metamask';
import { useGeneralStore } from '@/stores/general';
import type { ToastServiceMethods } from 'primevue/toastservice';

const generalStore = useGeneralStore();
const mmStore = useMetamaskStore();
const router = useRouter();
const isLoading = ref(false);

const toast = generalStore.toast as ToastServiceMethods;

const copyToClipboard = (type: string) => {
  if (type === 'did') {
    navigator.clipboard.writeText(mmStore.DID ?? '');
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Copied DID to clipboard.',
      group: 'br',
      life: 3000,
    });
  } else if (type === 'mmAddr') {
    navigator.clipboard.writeText(mmStore.mmAddress ?? '');
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Copied address to clipboard.',
      group: 'br',
      life: 3000,
    });
  }
};

async function connectToMM() {
  isLoading.value = true;
  if (window.ethereum) {
    window.ethereum
      .request({ method: 'eth_requestAccounts' })
      .then((result: unknown) => {
        // console.log("Setting MetaMask address!");
        mmStore.mmAddress = (result as string[])[0];
      })
      .catch((err: Error) => {
        isLoading.value = false;
        console.error(err);
        return;
      });

    let snapId = 'local:http://localhost:8081';
    //let snapId = undefined;
    try {
      const result = await installSnap(snapId);
      if (result.isSnapInstalled) {
        const api = await result.snap?.getSSISnapApi();
        if (!api) return;
        isLoading.value = false;
        mmStore.snapApi = api;
        const initResponse = await initStore(api);
        if (initResponse) {
          mmStore.DID = initResponse.did;
          mmStore.currDIDMethod = initResponse.currDIDMethod;
          mmStore.availableMethods = initResponse.availableMethods;
          mmStore.currVCStore = initResponse.currVCStore;
          mmStore.useCeramic = initResponse.currVCStore === 'ceramic';
        }

        router.push('/');
      }
    } catch (err) {
      isLoading.value = false;
      console.error(err);
    }
  }
}
</script>

<style>
.p-chip {
  white-space: pre-line;
}

.p-chip .p-chip-text {
  cursor: pointer !important;
}
</style>
