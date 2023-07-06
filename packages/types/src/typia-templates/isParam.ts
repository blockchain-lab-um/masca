import typia from 'typia';

import {
  // isAvailableMethods,
  isAvailableVCStores,
  // isSupportedProofFormat,
  type AvailableVCStores,
  type CreateVCRequestParams,
  type CreateVPRequestParams,
  type DeleteVCsRequestParams,
  type MascaState,
  type QueryVCsRequestParams,
  type ResolveDIDRequestParams,
  type SaveVCRequestParams,
  type SetCurrentAccountRequestParams,
  type SetVCStoreRequestParams,
  type SwitchMethodRequestParams,
  type VerifyDataRequestParams,
} from '../index.js';

const isEnabledVCStore = (
  account: string,
  state: MascaState,
  store: AvailableVCStores
): boolean => state.accountState[account].accountConfig.ssi.vcStore[store];

const formatErrorMessages = (errors: typia.IValidation.IError[]): string => {
  let errorMessage = 'invalid_argument: ';

  for (let i = 0; i < errors.length; i += 1) {
    errorMessage += errors[i].path;
    if (i < errors.length - 1) {
      errorMessage += ', ';
    }
  }

  return errorMessage;
};

export const handleIValidation = (result: typia.IValidation<unknown>) => {
  if (result.success) {
    return undefined;
  }
  return formatErrorMessages(result.errors);
};

const validateCreateVCRequest =
  typia.createValidateEquals<CreateVCRequestParams>();
const validateCreateVPRequest =
  typia.createValidateEquals<CreateVPRequestParams>();
const validateDeleteVCsRequest =
  typia.createValidateEquals<DeleteVCsRequestParams>();
const validateQueryVCsRequest =
  typia.createValidateEquals<QueryVCsRequestParams>();
const validateResolveDIDRequest =
  typia.createValidateEquals<ResolveDIDRequestParams>();
const validateSaveVCRequest = typia.createValidateEquals<SaveVCRequestParams>();
const validateSetCurrentAccountRequest =
  typia.createValidateEquals<SetCurrentAccountRequestParams>();
const validateSetVCStoreRequest =
  typia.createValidateEquals<SetVCStoreRequestParams>();
const validateSwitchMethodRequest =
  typia.createValidateEquals<SwitchMethodRequestParams>();
const validateVerifyDataRequest =
  typia.createValidateEquals<VerifyDataRequestParams>();

export const isValidCreateVCRequestParams = (
  input: any,
  account: string,
  state: MascaState
): asserts input is CreateVCRequestParams => {
  const res = validateCreateVCRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
  const value = input as CreateVCRequestParams;
  if (typeof value.options?.store === 'string') {
    if (!isAvailableVCStores(input.options?.store)) {
      throw new Error(`Store ${value.options?.store} is not supported!`);
    }
    if (!isEnabledVCStore(account, state, input.options?.store)) {
      throw new Error(`Store ${value.options?.store} is not enabled!`);
    }
  } else if (
    value.options?.store &&
    Array.isArray(value.options?.store) &&
    value.options?.store.length > 0
  ) {
    (value.options?.store as [string]).forEach((store) => {
      if (!isAvailableVCStores(store))
        throw new Error(`Store ${store} is not supported!`);
      if (!isEnabledVCStore(account, state, store as AvailableVCStores))
        throw new Error(`Store ${store} is not enabled!`);
    });
  }
};
// export const isValidCreateVPRequest = (input: any) =>
//   handleIValidation(validateCreateVPRequest(input));
// export const isValidDeleteVCsRequest = (input: any) =>
//   handleIValidation(validateDeleteVCsRequest(input));
// export const isValidQueryVCsRequest = (input: any) =>
//   handleIValidation(validateQueryVCsRequest(input));
// export const isValidResolveDIDRequest = (input: any) =>
//   handleIValidation(validateResolveDIDRequest(input));
// export const isValidSaveVCRequest = (input: any) =>
//   handleIValidation(validateSaveVCRequest(input));
// export const isValidSetCurrentAccountRequest = (input: any) =>
//   handleIValidation(validateSetCurrentAccountRequest(input));
// export const isValidSetVCStoreRequest = (input: any) =>
//   handleIValidation(validateSetVCStoreRequest(input));
// export const isValidSwitchMethodRequest = (input: any) =>
//   handleIValidation(validateSwitchMethodRequest(input));
// export const isValidVerifyDataRequest = (input: any) =>
//   handleIValidation(validateVerifyDataRequest(input));
