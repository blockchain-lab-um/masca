import type { W3CVerifiableCredential } from '@veramo/core';
import axios from 'axios';
import { enableSSISnap } from '@blockchain-lab-um/ssi-snap-connector';
import type {
  AvailableVCStores,
  QueryVCsRequestResult,
  SSISnapApi,
  VCRequest,
} from '@blockchain-lab-um/ssi-snap-types';
import type {
  SnapInstallationParams,
  DIDMethod,
  storeInitResponse,
  SnapInitializationResponse,
} from './interfaces';

const backend_url = 'https://bclabum.informatika.uni-mb.si/ssi-demo-backend';

export async function installSnap(
  snapId?: string,
  supportedMethods?: ('did:ethr' | 'did:key')[]
): Promise<SnapInitializationResponse> {
  try {
    // console.log("Connecting to snap...");
    if (!supportedMethods) supportedMethods = ['did:ethr', 'did:key'];
    const snapInstallationParams: SnapInstallationParams = {

      version: 'latest',

      supportedMethods,
    };
    if (snapId) snapInstallationParams.snapId = snapId;
    if (supportedMethods)
      snapInstallationParams.supportedMethods = supportedMethods;

    const metamaskSSISnap = await enableSSISnap(snapInstallationParams);

    // console.log("Snap installed!");
    return {
      isSnapInstalled: true,
      snap: metamaskSSISnap,
    } as SnapInitializationResponse;
  } catch (e) {
    console.error(e);
    return { isSnapInstalled: false } as SnapInitializationResponse;
  }
}

export async function checkForVCs(snapApi?: SSISnapApi) {
  if (!snapApi) throw new Error('No snap API found.');
  const vcs = await snapApi.queryVCs();
  if (!vcs.length) {
    throw new Error('No VCs found.');
  }
  return vcs;
}

export async function createVC(
  userName: string,
  mmAddress?: string,
  snapApi?: SSISnapApi
) {
  try {
    if (!snapApi) throw new Error('No snap API found.');
    if (!mmAddress) throw new Error('No metamask address found.');
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const body = {
      name: userName,
      id: 'did:ethr:rinkeby:' + mmAddress,
    };
    const VC = await axios
      .post(backend_url + '/api/vc/issue-vc', body, axiosConfig)
      .then((response: any) => {
        return response.data;
      })
      .catch((error: any) => {
        console.log(error);
      });

    const res = await saveVC(VC, snapApi);
    if (res) return true;
  } catch (err) {
    console.error(err);
  }
}

export async function saveVC(
  VC: W3CVerifiableCredential,
  snapApi?: SSISnapApi,
  store?: AvailableVCStores
) {
  try {
    if (!snapApi) throw new Error('No snap API found.');
    const res = await snapApi?.saveVC(VC, { store });
    return res;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createVP(
  VCs: QueryVCsRequestResult[],
  snapApi?: SSISnapApi
) {
  try {
    if (!snapApi) throw new Error('No snap API found.');
    const vcs: VCRequest[] = [];
    if (VCs.length === 0) throw new Error('No VCs found.');
    VCs.forEach((vc) => {
      if ('metadata' in vc && 'id' in vc.metadata)
        vcs.push({ id: vc.metadata.id });
    });
    const res = await snapApi?.createVP({ vcs });
    if (res) {
      // console.log("Created VP.");
      return res;
    } else {
      // console.log("VP not created.");
      throw new Error('VP not created.');
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function createDIDMethod(DID?: string) {
  if (!DID) return undefined;
  const splitDID = DID.split(':');
  if (splitDID.length < 2) return undefined;
  const didName = splitDID[1];
  return {
    value: splitDID[0] + ':' + splitDID[1],
    text: didName.charAt(0).toUpperCase() + didName.slice(1),
  };
}

export async function initStore(snapApi: SSISnapApi) {
  try {
    const [did, methods, vcStore] = await Promise.all([
      snapApi.getDID(),
      snapApi.getAvailableMethods(),
      snapApi.getVCStore(),
    ]);

    let currDIDMethod, availableMethods;
    if (did) {
      currDIDMethod = createDIDMethod(did);
    }
    if (methods) {
      availableMethods = methods.map((method: string) => {
        const methodName = method.split(':')[1];
        return {
          value: method,
          text: methodName.charAt(0).toUpperCase() + methodName.slice(1),
        } as DIDMethod;
      });
    }
    return {
      did,
      currDIDMethod,
      availableMethods,
      currVCStore: vcStore,
    } as storeInitResponse;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function checkAvailableStores(snapApi?: SSISnapApi) {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!snapApi) throw new Error('No snap API found.');
    const stores = await snapApi.getAvailableVCStores();
    if (!stores.length) {
      throw new Error('No stores found.');
    }
    return stores;
  } catch (err: any) {
    throw err;
  }
}

export async function setVCStore(
  vcStore: string,
  value: boolean,
  snapApi?: SSISnapApi
) {
  // eslint-disable-next-line no-useless-catch
  try {
    if (!snapApi) throw new Error('No snap API found.');
    const res = await snapApi.setVCStore(vcStore as AvailableVCStores, value);
    if (!res) {
      throw new Error('Failed to set store.');
    }
    return 'New VC store set.';
  } catch (err: any) {
    throw err;
  }
}
