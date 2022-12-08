import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type {
  QueryVCsRequestResult,
  SSISnapApi,
} from '@blockchain-lab-um/ssi-snap-types';
import type { VerifiableCredential, DIDMethod } from '../util/interfaces';

export const useMetamaskStore = defineStore('metamask', () => {
  // Store values
  const mmAddress = ref<string | undefined>(undefined);
  const snapApi = ref<SSISnapApi | undefined>(undefined);
  const DID = ref<string | undefined>(undefined);
  const currDIDMethod = ref<DIDMethod | undefined>(undefined);
  const availableMethods = ref<DIDMethod[] | undefined>(undefined);
  const verifiableCredential = ref<VerifiableCredential | undefined>(undefined);
  const vcs = ref<QueryVCsRequestResult[]>([] as QueryVCsRequestResult[]);
  const currVCStore = ref<string | undefined>(undefined);
  const useCeramic = ref<boolean>(false);

  // Read only values
  const vcIssuerId = computed(() => {
    return 'did:ethr:rinkeby:0x0241abd662da06d0af2f0152a80bc037f65a7f901160cfe1eb35ef3f0c532a2a4d';
  });

  const snapInstalled = computed(() => {
    return mmAddress.value && snapApi.value ? true : false;
  });

  const didString = computed(() => {
    return DID.value
      ? DID.value.substring(0, 20) +
          '...' +
          DID.value.substring(DID.value.length - 4)
      : 'No DID';
  });

  const mmAddressString = computed(() => {
    return mmAddress.value
      ? mmAddress.value.substring(0, 10) +
          '...' +
          mmAddress.value.substring(mmAddress.value.length - 4)
      : 'No MM address';
  });

  const didMethodString = computed(() => {
    return DID.value
      ? DID.value.split(':')[0] + ':' + DID.value.split(':')[1]
      : undefined;
  });

  const vcStores = computed(() => {
    return ['snap', 'ceramic'];
  });

  return {
    snapInstalled,
    mmAddress,
    mmAddressString,
    didString,
    snapApi,
    DID,
    didMethodString,
    currDIDMethod,
    availableMethods,
    verifiableCredential,
    vcs,
    vcIssuerId,
    useCeramic,
    vcStores,
    currVCStore,
  };
});
