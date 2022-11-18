<template>
  <div class="settings">
    <h1 id="title">SSI Snap Configuration</h1>
    <div class="settingsContent">
      <div class="center">
        <p>Use Ceramic VC store:</p>
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
        />
      </div>

      <div class="infuraInput">
        <InputText
          id="infuraToken"
          type="text"
          placeholder="Input infura token"
        />
        <wrappedButton
          label="Change infura token"
          :method="changeInfuraToken"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import wrappedButton from '@/components/wrappedButton.vue';
import { useMetamaskStore } from '@/stores/metamask';
import { useGeneralStore } from '@/stores/general';
import { setVCStore } from '@/util/snap';
import type { ToastServiceMethods } from 'primevue/toastservice';
import type InputText from 'primevue/inputtext';

const mmStore = useMetamaskStore();
const generalStore = useGeneralStore();
const toast = generalStore.toast as ToastServiceMethods;

const toggleCeramic = async (val: boolean) => {
  try {
    let store = val ? 'ceramic' : 'snap';
    const res = await setVCStore(store, mmStore.snapApi);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: res,
      group: 'br',
      life: 3000,
    });
  } catch (error: any) {
    mmStore.currVCStore = val ? 'ceramic' : 'snap';
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
  try {
    const res = await mmStore.snapApi?.togglePopups();
    if (!res) throw new Error('Failed to toggle popups');
    return 'Success toggling popups.';
  } catch (error) {
    throw error;
  }
};

const changeInfuraToken = async () => {
  try {
    const infuraInput = document.getElementById('infuraToken');
    infuraInput?.classList.remove('p-invalid');
    const infuraToken = (infuraInput as HTMLInputElement)?.value;
    //console.log('🚀 ~ file: SettingsView.vue ~ line 49 ~ changeInfuraToken ~ infuraToken', infuraToken);
    if (!infuraToken) {
      infuraInput?.classList.add('p-invalid');
      return;
    }
    const res = await mmStore.snapApi?.changeInfuraToken(infuraToken);
    if (!res) {
      throw new Error('Failed to change infura token.');
    }
    (<HTMLInputElement>document.getElementById('infuraToken')).value = '';
    return 'Success changing infura token';
  } catch (error) {
    console.error(error);
    throw error;
  }
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
