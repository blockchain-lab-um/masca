<template>
  <div id="vcForm">
    <h2>Enter your name to create a test Verifiable Credential</h2>
    <div class="course-input">
      <InputText
        id="nameInput"
        type="username"
        class="p-inputtext-sm"
        placeholder="Username"
      />
      <wrappedButton
        label="Create VC"
        :method="VCCreate"
        cssClass="p-button-sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import wrappedButton from '@/components/wrappedButton.vue';
import { useMetamaskStore } from '@/stores/metamask';
import { createVC } from '@/util/snap';

const mmStore = useMetamaskStore();

const VCCreate = async () => {
  try {
    const nameInput = document.getElementById('nameInput');
    nameInput?.classList.remove('p-invalid');
    const nameInputValue = (nameInput as HTMLInputElement).value;
    if (!nameInputValue) {
      nameInput?.classList.add('p-invalid');
      return;
    }

    const res = await createVC(
      nameInputValue,
      mmStore.mmAddress,
      mmStore.snapApi
    );
    if (!res) {
      throw new Error('Failed to create VC');
    }
    return 'VC created';
  } catch (err: any) {
    throw new Error(err.message);
  }
};
</script>

<style scoped>
.vcForm {
  display: flex;
  justify-content: center;
}

.course-input {
  display: flex;
  justify-content: center;
}

.course-input * {
  margin: 0rem 1rem;
}
</style>
