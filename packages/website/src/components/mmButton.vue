<template>
  <pButton
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
      icon="pi pi-copy"
      class="p-mr-2"
      @click="copyToClipboard(mmStore.DID)"
    />
    <Chip
      :label="mmStore.mmAddressString"
      icon="pi pi-copy"
      class="p-mr-2"
      @click="copyToClipboard(mmStore.mmAddress)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { installSnap, initStore } from '../util/snap';
import { useMetamaskStore } from '@/stores/metamask';
import { copyToClipboard } from '@/util/general';

const mmStore = useMetamaskStore();
const router = useRouter();
const isLoading = ref(false);

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

.p-chip:hover {
  background-color: #cccccc;
}
</style>
