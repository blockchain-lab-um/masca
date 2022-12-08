<template>
  <div class="profile">
    <h1 id="title">Available VCs</h1>
    <div>
      <DataTable
        :value="mmStore.vcs"
        responsiveLayout="scroll"
        removableSort
        v-model:selection="selectedVC"
        selectionMode="multiple"
        dataKey="id"
      >
        <template #header>
          <div class="table-header">
            Verifiable Credentials
            <div class="dtButtons">
              <Button
                @click="openImportModal"
                label="Import VC"
                icon="pi pi-file-import"
              />
              <wrappedButton
                label="Load VCs"
                :method="loadVCs"
                icon="pi pi-refresh"
              />
              <wrappedButton
                label="Create VP"
                :method="vpCreate"
                icon="pi pi-upload"
              />
            </div>
          </div>
        </template>
        <Column field="data.id" header="VC Id" />
        <Column field="issuanceDate" header="Issuance Date" :sortable="true">
          <template #body="slotProps">
            {{ ISOtoLocaleString(slotProps.data.data.issuanceDate) }}
          </template>
        </Column>
        <Column field="data.issuer.id" header="Issuer Id" />
        <Column header="View">
          <template #body="slotProps">
            <Button
              icon="pi pi-search"
              class="p-button-rounded p-button-outlined"
              @click="
                openModal(
                  'Verifiable Credential',
                  JSON.stringify(slotProps.data, null, 2)
                )
              "
            />
          </template>
        </Column>
        <template #footer>
          In total there are {{ mmStore.vcs ? mmStore.vcs.length : 0 }} VCs.
        </template>
      </DataTable>
    </div>
    <Dialog
      header="Import VC (JSON)"
      v-model:visible="displayImportModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <Textarea
        id="VCImportArea"
        v-model="VCImport"
        autofocus
        :autoResize="true"
        class="vcImport"
      />
      <template #footer>
        <Button
          label="Cancel"
          icon="pi pi-times"
          @click="closeImportModal()"
          class="p-button-text"
        />
        <wrappedButton label="Import" :method="importVC" icon="pi pi-check" />
      </template>
    </Dialog>
    <Dialog
      :header="modalTitle"
      v-model:visible="displayModal"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
      :style="{ width: '50vw' }"
      :modal="true"
    >
      <Textarea
        id="VCImportArea"
        v-model="modalContent"
        autofocus
        :autoResize="true"
        class="vcImport"
      />
      <template #footer>
        <Button
          label="Close"
          icon="pi pi-times"
          @click="closeModal()"
          class="p-button-text"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import wrappedButton from '@/components/wrappedButton.vue';
import { ref } from 'vue';
import { useMetamaskStore } from '@/stores/metamask';
import { ISOtoLocaleString } from '@/util/general';
import { checkForVCs, saveVC, createVP } from '@/util/snap';
import type { VerifiableCredential } from '../util/interfaces';
import type { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';

const mmStore = useMetamaskStore();
const VCImport = ref('');
const displayImportModal = ref(false);
const displayModal = ref(false);
const modalTitle = ref('Modal');
const modalContent = ref('');
const selectedVC = ref<QueryVCsRequestResult[] | undefined>([]);

const openImportModal = () => {
  displayImportModal.value = true;
};

const closeImportModal = () => {
  VCImport.value = '';
  displayImportModal.value = false;
};

const openModal = (title: string, content: string) => {
  modalTitle.value = title;
  modalContent.value = content;
  displayModal.value = true;
};

const closeModal = () => {
  modalTitle.value = '';
  modalContent.value = '';
  displayModal.value = false;
};

const loadVCs = async () => {
  try {
    const validVCs = await checkForVCs(mmStore.snapApi);
    console.log(validVCs);
    if (validVCs) {
      mmStore.vcs = validVCs;
    }
    return 'Success getting VCs';
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};

const vpCreate = async () => {
  try {
    if (!selectedVC.value) {
      throw new Error('No VC selected');
    }
    const vp = await createVP(selectedVC.value, mmStore.snapApi);
    openModal('Verifiable Presentation', JSON.stringify(vp, null, 2));
    if (!vp) {
      throw new Error('Failed to create VP');
    }
    return 'VP created';
  } catch (err: any) {
    throw new Error(err.message);
  }
};

const importVC = async () => {
  let VC: VerifiableCredential;
  // eslint-disable-next-line no-useless-catch
  try {
    VC = JSON.parse(VCImport.value) as VerifiableCredential;
  } catch (err: any) {
    throw err;
  }
  // console.log('🚀 ~ file: ProfileView.vue ~ line 54 ~ importVC ~ VC', VC);
  try {
    const res = await saveVC(VC, mmStore.snapApi);
    if (!res) throw new Error('Failed to save VC');
    // console.log('🚀 ~ file: ProfileView.vue ~ line 48 ~ importVC ~ res', res);
    mmStore.vcs.push(VC);
    closeImportModal();
    return 'Success importing VC';
  } catch (err: any) {
    console.error(err);
    throw err;
  }
};
</script>

<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dtButtons button {
  margin: 0px 5px;
}

.vcImport {
  width: 100%;
}

#title {
  text-align: center;
}

.profile {
  margin: 0 5rem;
}
</style>
