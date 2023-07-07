import typia from 'typia';

import {
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

const checkVCStore = (param: any, account: string, state: MascaState): void => {
  if (
    param.options &&
    'store' in param.options &&
    param.options?.store !== null
  ) {
    if (typeof param.options?.store === 'string') {
      if (!isEnabledVCStore(account, state, param.options?.store)) {
        throw new Error(
          `Store ${param.options?.store as string} is not enabled!`
        );
      }
    } else if (
      Array.isArray(param.options?.store) &&
      param.options?.store.length > 0
    ) {
      (param.options?.store as [string]).forEach((store) => {
        if (!isEnabledVCStore(account, state, store as AvailableVCStores))
          throw new Error(`Store ${store} is not enabled!`);
      });
    }
  }
};

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

const handleIValidation = (result: typia.IValidation<unknown>) => {
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

export const isValidCreateVCRequest = (
  input: any,
  account: string,
  state: MascaState
): asserts input is CreateVCRequestParams => {
  const res = validateCreateVCRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
  checkVCStore(input as CreateVCRequestParams, account, state);
};

export const isValidCreateVPRequest = (
  input: any
): asserts input is CreateVPRequestParams => {
  const res = validateCreateVPRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
};

export const isValidDeleteVCsRequest = (
  input: any,
  account: string,
  state: MascaState
): asserts input is DeleteVCsRequestParams => {
  const res = validateDeleteVCsRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
  checkVCStore(input as DeleteVCsRequestParams, account, state);
};

export const isValidQueryVCsRequest = (
  input: any,
  account: string,
  state: MascaState
): asserts input is QueryVCsRequestParams => {
  const res = validateQueryVCsRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
  checkVCStore(input as QueryVCsRequestParams, account, state);
};

export const isValidResolveDIDRequest = (
  input: any
): asserts input is ResolveDIDRequestParams => {
  const res = validateResolveDIDRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
};

export const isValidSaveVCRequest = (
  input: any,
  account: string,
  state: MascaState
): asserts input is SaveVCRequestParams => {
  const res = validateSaveVCRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
  checkVCStore(input as SaveVCRequestParams, account, state);
};

export const isValidSetCurrentAccountRequest = (
  input: any
): asserts input is SetCurrentAccountRequestParams => {
  const res = validateSetCurrentAccountRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
};

export const isValidSetVCStoreRequest = (
  input: any
): asserts input is SetVCStoreRequestParams => {
  const res = validateSetVCStoreRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
};

export const isValidSwitchMethodRequest = (
  input: any
): asserts input is SwitchMethodRequestParams => {
  const res = validateSwitchMethodRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
};

export const isValidVerifyDataRequest = (
  input: any
): asserts input is VerifyDataRequestParams => {
  const res = validateVerifyDataRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
};
