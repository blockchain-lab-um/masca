import {
  AvailableMethods,
  AvailableVCStores,
  CreateVPRequestParams,
  DeleteVCsOptions,
  MetaMaskSSISnapRPCRequest,
  QueryVCsRequestParams,
  QueryVCsRequestResult,
  SSIAccountConfig,
  SSISnapApi,
  SSISnapConfig,
  SaveVCOptions,
  SaveVCRequestResult,
} from '@blockchain-lab-um/ssi-snap-types';
import {
  DIDResolutionResult,
  VerifiablePresentation,
  W3CVerifiableCredential,
} from '@veramo/core';

async function sendSnapMethod<T>(
  request: MetaMaskSSISnapRPCRequest,
  snapId: string
): Promise<T> {
  const mmRequest = {
    method: snapId,
    params: request,
  };
  console.log(mmRequest);
  return window.ethereum.request(mmRequest);
}

/**
 * Get a list of VCs stored in the SSI Snap under currently selected MetaMask account
 */
export async function queryVCs(
  this: MetaMaskSSISnap,
  params?: QueryVCsRequestParams
): Promise<QueryVCsRequestResult[]> {
  return sendSnapMethod(
    { method: 'queryVCs', params: params || {} },
    this.snapId
  );
}

/**
 * Create a VP from a VC
 */
export async function createVP(
  this: MetaMaskSSISnap,
  params: CreateVPRequestParams
): Promise<VerifiablePresentation> {
  return sendSnapMethod(
    {
      method: 'createVP',
      params,
    },
    this.snapId
  );
}

/**
 * Save a VC in the SSI Snap under currently selected MetaMask account
 */
export async function saveVC(
  this: MetaMaskSSISnap,
  vc: W3CVerifiableCredential,
  options?: SaveVCOptions
): Promise<SaveVCRequestResult[]> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return sendSnapMethod(
    {
      method: 'saveVC',
      params: {
        verifiableCredential: vc,
        options,
      },
    },
    this.snapId
  );
}

export async function deleteVC(
  this: MetaMaskSSISnap,
  id: string,
  options?: DeleteVCsOptions
): Promise<boolean[]> {
  return sendSnapMethod(
    {
      method: 'deleteVC',
      params: {
        id,
        options,
      },
    },
    this.snapId
  );
}

export async function getDID(this: MetaMaskSSISnap): Promise<string> {
  return sendSnapMethod({ method: 'getDID' }, this.snapId);
}

export async function getSelectedMethod(
  this: MetaMaskSSISnap
): Promise<string> {
  return sendSnapMethod({ method: 'getSelectedMethod' }, this.snapId);
}

export async function getAvailableMethods(
  this: MetaMaskSSISnap
): Promise<string[]> {
  return sendSnapMethod({ method: 'getAvailableMethods' }, this.snapId);
}

export async function switchDIDMethod(
  this: MetaMaskSSISnap,
  method: AvailableMethods
): Promise<boolean> {
  return sendSnapMethod(
    { method: 'switchDIDMethod', params: { didMethod: method } },
    this.snapId
  );
}

/**
 * Toggle popups - enable/disable "Are you sure?" confirmation windows when retrieving VCs and generating VPs,...
 *
 */
export async function togglePopups(this: MetaMaskSSISnap): Promise<boolean> {
  return sendSnapMethod({ method: 'togglePopups' }, this.snapId);
}

export async function getVCStore(
  this: MetaMaskSSISnap
): Promise<Record<AvailableVCStores, boolean>> {
  return sendSnapMethod({ method: 'getVCStore' }, this.snapId);
}

export async function getAvailableVCStores(
  this: MetaMaskSSISnap
): Promise<string[]> {
  return sendSnapMethod({ method: 'getAvailableVCStores' }, this.snapId);
}

export async function setVCStore(
  this: MetaMaskSSISnap,
  store: AvailableVCStores,
  value: boolean
): Promise<boolean> {
  return sendSnapMethod(
    { method: 'setVCStore', params: { store, value } },
    this.snapId
  );
}

export async function getAccountSettings(
  this: MetaMaskSSISnap
): Promise<SSIAccountConfig> {
  return sendSnapMethod({ method: 'getAccountSettings' }, this.snapId);
}
export async function getSnapSettings(
  this: MetaMaskSSISnap
): Promise<SSISnapConfig> {
  return sendSnapMethod({ method: 'getSnapSettings' }, this.snapId);
}

export async function resolveDID(
  this: MetaMaskSSISnap,
  did: string
): Promise<DIDResolutionResult> {
  return sendSnapMethod({ method: 'resolveDID', params: { did } }, this.snapId);
}

export class MetaMaskSSISnap {
  // snap parameters
  protected readonly snapOrigin: string;

  protected readonly snapId: string;

  public readonly supportedMethods: Array<AvailableMethods>;

  public constructor(
    snapOrigin: string,
    supportedMethods: Array<AvailableMethods>
  ) {
    this.snapOrigin = snapOrigin;
    this.snapId = `wallet_snap_${this.snapOrigin}`;
    this.supportedMethods = supportedMethods;

    window.ethereum.on('accountsChanged', this.accountChanged);
  }

  public accountChanged = (accounts: string[]) => {
    console.log('Account changed', accounts[0]);
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  public getSSISnapApi = async (): Promise<SSISnapApi> => {
    return {
      saveVC: saveVC.bind(this),
      queryVCs: queryVCs.bind(this),
      createVP: createVP.bind(this),
      togglePopups: togglePopups.bind(this),
      getDID: getDID.bind(this),
      getSelectedMethod: getSelectedMethod.bind(this),
      getAvailableMethods: getAvailableMethods.bind(this),
      switchDIDMethod: switchDIDMethod.bind(this),
      getVCStore: getVCStore.bind(this),
      setVCStore: setVCStore.bind(this),
      getAvailableVCStores: getAvailableVCStores.bind(this),
      deleteVC: deleteVC.bind(this),
      getSnapSettings: getSnapSettings.bind(this),
      getAccountSettings: getAccountSettings.bind(this),
      resolveDID: resolveDID.bind(this),
    };
  };
}
