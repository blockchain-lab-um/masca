import axios from 'axios';
import { enableSSISnap } from '@blockchain-lab-um/ssi-snap-connector';
import type { SSISnapApi } from '@blockchain-lab-um/ssi-snap-types';
import type {
  SnapInstallationParams,
  VerifiableCredential,
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
  try {
    if (!snapApi) {
      throw new Error('No snap API found.');
    }
    const vcs = await snapApi.getVCs();
    if (!vcs.length) {
      throw new Error('No VCs found.');
    }
    return vcs as VerifiableCredential[];
  } catch (err: any) {
    throw err;
  }
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

export async function saveVC(VC: VerifiableCredential, snapApi?: SSISnapApi) {
  try {
    if (!snapApi) throw new Error('No snap API found.');
    const res = await snapApi?.saveVC(VC);
    if (res) {
      // console.log("Saved VC.");
      return true;
    } else {
      // console.log("VC not saved.");
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

export async function createVP(VC: VerifiableCredential, snapApi?: SSISnapApi) {
  try {
    if (!snapApi) throw new Error('No snap API found.');
    const res = await snapApi?.getVP(VC.key);
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
  const didName = splitDID[0] + ':' + splitDID[1];
  return {
    value: didName,
    text: didName,
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
      availableMethods = methods.map((method) => {
        return {
          value: method,
          text: method,
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
  try {
    if (!snapApi) {
      throw new Error('No snap API found.');
    }
    const stores = await snapApi.getAvailableVCStores();
    if (!stores.length) {
      throw new Error('No stores found.');
    }
    return stores;
  } catch (err: any) {
    throw err;
  }
}

export async function setVCStore(vcStore: string, snapApi?: SSISnapApi) {
  try {
    if (!snapApi) {
      throw new Error('No snap API found.');
    }
    const res = await snapApi.setVCStore(vcStore);
    if (!res) {
      throw new Error('Failed to set store.');
    }
    return 'New VC store set.';
  } catch (err: any) {
    throw err;
  }
}
