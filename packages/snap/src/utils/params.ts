import { VCQuery } from '@blockchain-lab-um/ssi-snap-types';
import { W3CVerifiableCredential } from '@veramo/core';
import {
  AvailableMethods,
  AvailableVCStores,
  isAvailableMethods,
  isAvailableVCStores,
  isSupportedProofFormat,
  SupportedProofFormats,
} from '../constants';

type GetVCsRequestParams = { query?: VCQuery };

type CreateVPRequestParams = {
  vcs: [
    {
      id: string;
      metadata?: {
        store?: AvailableVCStores;
      };
    }
  ];
  proofFormat?: SupportedProofFormats;
  proofOptions?: {
    type?: string;
    domain?: string;
    challenge?: string;
  };
};

type QueryRequestParams = {
  filter?: {
    type: string;
    filter: any;
  };
  options?: {
    store?: AvailableVCStores | [AvailableVCStores];
    returnStore?: boolean;
  };
};

type SaveVCRequestParams = {
  verifiableCredential: W3CVerifiableCredential;
  options?: {
    store?: AvailableVCStores | [AvailableVCStores];
  };
};

type DeleteVCRequestParams = {
  id: string | [string];
  options?: {
    store?: AvailableVCStores | [AvailableVCStores];
  };
};

type ChangeInfuraTokenRequestParams = {
  infuraToken: string;
};

type SwitchMethodRequestParams = {
  didMethod: AvailableMethods;
};

type SetVCStoreRequestParams = {
  store: AvailableVCStores;
  value: boolean;
};

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

export function isValidGetVCsRequest(
  params: unknown
): asserts params is GetVCsRequestParams {
  if (params != null && typeof params === 'object' && 'query' in params) return;

  throw new Error('Invalid GetVCs request');
}

export function isValidSaveVCRequest(
  params: unknown
): asserts params is SaveVCRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'verifiableCredential' in params &&
    (params as SaveVCRequestParams).verifiableCredential != null
  ) {
    if (
      'options' in params &&
      (params as SaveVCRequestParams).options != null &&
      typeof (params as SaveVCRequestParams).options === 'object'
    ) {
      if (
        'store' in (params as SaveVCRequestParams).options &&
        (params as SaveVCRequestParams).options?.store != null
      ) {
        if (typeof (params as SaveVCRequestParams).options?.store == 'string') {
          if (
            !isAvailableVCStores(
              (params as SaveVCRequestParams).options?.store as string
            )
          ) {
            throw new Error('Store is not supported!');
          }
        } else if (
          Array.isArray((params as SaveVCRequestParams).options?.store) &&
          (params as SaveVCRequestParams).options?.store.length > 0
        ) {
          ((params as SaveVCRequestParams).options?.store as [string]).forEach(
            (store) => {
              if (!isAvailableVCStores(store))
                throw new Error('Store is not supported!');
            }
          );
        } else throw new Error('Store is invalid format');
      }
    }
    return;
  }
  throw new Error('Invalid SaveVC request');
}

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
      !isSupportedProofFormat(
        (params as CreateVPRequestParams).proofFormat as string
      )
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

export function isValidSetVCStoreRequest(
  params: unknown
): asserts params is SetVCStoreRequestParams {
  if (
    params != null &&
    typeof params === 'object' &&
    'store' in params &&
    (params as SetVCStoreRequestParams).store != null &&
    'value' in params &&
    (params as SetVCStoreRequestParams).value != null &&
    typeof (params as SetVCStoreRequestParams).value === 'boolean'
  ) {
    if (!isAvailableVCStores((params as SetVCStoreRequestParams).store)) {
      throw new Error('Store is not supported!');
    }
    return;
  }
  throw new Error('Invalid setVCStore request.');
}

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

export function isValidQueryRequest(
  params: unknown
): asserts params is QueryRequestParams {
  if (params == null) {
    return;
  }
  if (
    'filter' in params &&
    (params as QueryRequestParams).filter != null &&
    typeof (params as QueryRequestParams).filter === 'object'
  ) {
    if (
      !(
        'type' in (params as QueryRequestParams).filter &&
        (params as QueryRequestParams).filter?.type != null &&
        typeof (params as QueryRequestParams).filter?.type === 'string'
      )
    ) {
      throw new Error('Filter type is missing or not a string!');
    }
    if (
      !(
        'filter' in (params as QueryRequestParams).filter &&
        (params as QueryRequestParams).filter?.filter != null &&
        typeof (params as QueryRequestParams).filter?.filter === 'object'
      )
    ) {
      throw new Error('Filter is missing or not an object!');
    }
  }

  if (
    'options' in params &&
    (params as QueryRequestParams).options != null &&
    typeof (params as QueryRequestParams).options === 'object'
  ) {
    if (
      'store' in (params as QueryRequestParams).options &&
      (params as QueryRequestParams).options?.store != null
    ) {
      if (typeof (params as QueryRequestParams).options?.store == 'string') {
        if (
          !isAvailableVCStores(
            (params as QueryRequestParams).options?.store as string
          )
        ) {
          throw new Error('Store is not supported!');
        }
      } else if (
        Array.isArray((params as QueryRequestParams).options?.store) &&
        (params as QueryRequestParams).options?.store.length > 0
      ) {
        ((params as QueryRequestParams).options?.store as [string]).forEach(
          (store) => {
            if (!isAvailableVCStores(store))
              throw new Error('Store is not supported!');
          }
        );
      } else throw new Error('Store is invalid format');
    }
    if (
      !(
        'returnStore' in (params as QueryRequestParams).options &&
        (params as QueryRequestParams).options?.returnStore != null &&
        typeof (params as QueryRequestParams).options?.returnStore === 'boolean'
      )
    ) {
      throw new Error('ReturnStore is invalid format');
    }
  }
  console.log('filter correcto');
  return;
}
