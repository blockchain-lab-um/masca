import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import { VerifiableCredential, W3CVerifiableCredential } from '@veramo/core';
import {
  AvailableMethods,
  AvailableVCStores,
  isAvailableMethods,
  isAvailableVCStores,
} from '../constants';

function isStringArray(input: unknown): input is string[] {
  return (
    Array.isArray(input) &&
    input.length > 0 &&
    input.every((item) => typeof item === 'string')
  );
}
function isArray(input: unknown): input is unknown[] {
  return Array.isArray(input);
}

type GetVCsRequestParams = { query?: VCQuery };

export function isValidGetVCsRequest(
  params: unknown
): asserts params is GetVCsRequestParams {
  if (params != null && typeof params === 'object' && 'query' in params) return;

  throw new Error('Invalid GetVCs request');
}

type SaveVCRequestParams = {
  verifiableCredential: W3CVerifiableCredential;
  store?: AvailableVCStores | [AvailableVCStores];
};

export function isValidSaveVCRequest(
  params: unknown
): asserts params is SaveVCRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'verifiableCredential' in params &&
    (params as SaveVCRequestParams).verifiableCredential != null
  ) {
    if ('store' in params && (params as SaveVCRequestParams).store != null) {
      if (typeof (params as SaveVCRequestParams).store == 'string') {
        if (
          !isAvailableVCStores((params as SaveVCRequestParams).store as string)
        ) {
          throw new Error('Store is not supported!');
        }
      } else if (
        Array.isArray((params as SaveVCRequestParams).store) &&
        (params as SaveVCRequestParams).store.length > 0
      ) {
        ((params as SaveVCRequestParams).store as [string]).forEach((store) => {
          if (!isAvailableVCStores(store))
            throw new Error('Store is not supported!');
        });
      } else throw new Error('Store is invalid format');
    }
    return;
  }
  throw new Error('Invalid SaveVC request');
}

type CreateVPRequestParams = {
  vcs: [
    {
      id: string;
      metadata?: {
        store?: AvailableVCStores;
      };
    }
  ];

  proofFormat?: 'jwt' | 'lds';
  proofOptions?: {
    type?: string;
    domain?: string;
    challenge?: string;
  };
};
const pFs = ['jwt', 'lds'];

export function isValidCreateVPRequest(
  params: unknown
): asserts params is CreateVPRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'vcs' in params &&
    (params as CreateVPRequestParams).vcs != null &&
    isArray((params as CreateVPRequestParams).vcs) &&
    (params as CreateVPRequestParams).vcs.length > 0
  ) {
    // Check if proofFormat is valid
    if (
      'proofFormat' in params &&
      (params as CreateVPRequestParams).proofFormat != null &&
      !pFs.includes((params as CreateVPRequestParams).proofFormat as string)
    ) {
      throw new Error('Proof format not supported');
    }
    if (
      'proofOptions' in params &&
      (params as CreateVPRequestParams).proofOptions != null &&
      (params as CreateVPRequestParams).proofOptions?.domain != null &&
      typeof (params as CreateVPRequestParams).proofOptions?.domain != 'string'
    ) {
      throw new Error('Domain is not a string');
    }

    //check if challenge is a string
    if (
      'proofOptions' in params &&
      (params as CreateVPRequestParams).proofOptions != null &&
      (params as CreateVPRequestParams).proofOptions?.challenge != null &&
      typeof (params as CreateVPRequestParams).proofOptions?.challenge !=
        'string'
    ) {
      throw new Error('Challenge is not a string');
    }

    //check if type is correct string
    if (
      'proofOptions' in params &&
      (params as CreateVPRequestParams).proofOptions != null &&
      (params as CreateVPRequestParams).proofOptions?.type != null &&
      typeof (params as CreateVPRequestParams).proofOptions?.type != 'string'
    ) {
      throw new Error('Type is not a string');
    }

    // Check if vcs is valid
    (params as CreateVPRequestParams).vcs.forEach((vc) => {
      if (
        vc != null &&
        typeof vc === 'object' &&
        'id' in vc &&
        typeof vc.id === 'string'
      ) {
        if (
          'metadata' in vc &&
          vc.metadata != null &&
          typeof vc.metadata === 'object' &&
          'store' in vc.metadata &&
          vc.metadata.store != null &&
          typeof vc.metadata.store === 'string' &&
          !isAvailableVCStores(vc.metadata.store)
        ) {
          throw new Error('Store is not supported!');
        }
      } else throw new Error('VC is invalid format');
    });
    return;
  }

  throw new Error('Invalid CreateVP request');
}

type ChangeInfuraTokenRequestParams = {
  infuraToken: string;
};

export function isValidChangeInfuraTokenRequest(
  params: unknown
): asserts params is ChangeInfuraTokenRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'infuraToken' in params &&
    (params as ChangeInfuraTokenRequestParams).infuraToken != null &&
    typeof (params as ChangeInfuraTokenRequestParams).infuraToken === 'string'
  )
    return;

  throw new Error('Invalid ChangeInfuraToken request');
}

type SwitchMethodRequestParams = {
  didMethod: AvailableMethods;
};

export function isValidSwitchMethodRequest(
  params: unknown
): asserts params is SwitchMethodRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'didMethod' in params &&
    (params as SwitchMethodRequestParams).didMethod != null
  ) {
    if (!isAvailableMethods((params as SwitchMethodRequestParams).didMethod))
      throw new Error('Method is not supported!');
    return;
  }
  throw new Error('Invalid switchMethod request.');
}

type SetVCStoreRequestParams = {
  vcStore: AvailableVCStores;
  value: boolean;
};
export function isValidSetVCStoreRequest(
  params: unknown
): asserts params is SetVCStoreRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'vcStore' in params &&
    (params as SetVCStoreRequestParams).vcStore != null &&
    'value' in params &&
    (params as SetVCStoreRequestParams).value != null &&
    typeof (params as SetVCStoreRequestParams).value === 'boolean'
  ) {
    if (!isAvailableVCStores((params as SetVCStoreRequestParams).vcStore)) {
      throw new Error('Store is not supported!');
    }
    return;
  }
  throw new Error('Invalid setVCStore request.');
}

type DeleteVCRequestParams = {
  id: string | [string];
  options?: {
    store?: AvailableVCStores | [AvailableVCStores];
  };
};

export function isValidDeleteVCRequest(
  params: unknown
): asserts params is DeleteVCRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'id' in params &&
    (params as DeleteVCRequestParams).id != null
  ) {
    if (
      typeof (params as DeleteVCRequestParams).id != 'string' &&
      !isStringArray((params as DeleteVCRequestParams).id)
    ) {
      throw new Error('ID is not a string or array of strings');
    }
    if (
      'options' in params &&
      (params as DeleteVCRequestParams).options != null &&
      typeof (params as DeleteVCRequestParams).options === 'object'
    ) {
      if (
        'store' in (params as DeleteVCRequestParams).options &&
        (params as DeleteVCRequestParams).options?.store != null
      ) {
        if (
          typeof (params as DeleteVCRequestParams).options?.store == 'string'
        ) {
          if (
            !isAvailableVCStores(
              (params as DeleteVCRequestParams).options?.store as string
            )
          ) {
            throw new Error('Store is not supported!');
          }
        } else if (
          Array.isArray((params as DeleteVCRequestParams).options?.store) &&
          (params as DeleteVCRequestParams).options?.store.length > 0
        ) {
          (
            (params as DeleteVCRequestParams).options?.store as [string]
          ).forEach((store) => {
            if (!isAvailableVCStores(store))
              throw new Error('Store is not supported!');
          });
        } else throw new Error('Store is invalid format');
      }
    }
    return;
  }
  throw new Error('Invalid DeleteVC request');
}
