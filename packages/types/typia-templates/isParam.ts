import typia from 'typia';

import {
  availableCredentialStores,
  isW3CCredential,
  isW3CVerifiableCredential,
  type AvailableCredentialStores,
  type CreateCredentialRequestParams,
  type CreatePresentationRequestParams,
  type DeleteCredentialsRequestParams,
  type ImportStateBackupRequestParams,
  type MascaState,
  type QueryCredentialsRequestParams,
  type ResolveDIDRequestParams,
  type SaveCredentialRequestParams,
  type SetCredentialStoreRequestParams,
  type SetCurrentAccountRequestParams,
  type SwitchMethodRequestParams,
  type VerifyDataRequestParams,
} from '../src/index.js';

const isEnabledCredentialStore = (
  account: string,
  state: MascaState,
  store: AvailableCredentialStores
): boolean => state.accountState[account].accountConfig.ssi.vcStore[store];

const checkCredentialStore = (
  param: any,
  account: string,
  state: MascaState
): void => {
  let stores = param.options?.store || [];

  if (!Array.isArray(stores)) {
    stores = [stores];
  }

  for (const store of stores as typeof availableCredentialStores) {
    if (!isEnabledCredentialStore(account, state, store)) {
      throw new Error(`Store ${store} is not enabled!`);
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

const validateCreateCredentialRequest =
  typia.createValidateEquals<CreateCredentialRequestParams>();
const validateCreatePresentationRequest =
  typia.createValidateEquals<CreatePresentationRequestParams>();
const validateDeleteCredentialsRequest =
  typia.createValidateEquals<DeleteCredentialsRequestParams>();
const validateQueryCredentialsRequest =
  typia.createValidateEquals<QueryCredentialsRequestParams>();
const validateResolveDIDRequest =
  typia.createValidateEquals<ResolveDIDRequestParams>();
const validateSetCurrentAccountRequest =
  typia.createValidateEquals<SetCurrentAccountRequestParams>();
const validateSetCredentialStoreRequest =
  typia.createValidateEquals<SetCredentialStoreRequestParams>();
const validateSwitchMethodRequest =
  typia.createValidateEquals<SwitchMethodRequestParams>();
const validateVerifyDataRequest =
  typia.createValidateEquals<VerifyDataRequestParams>();
const validateMascaState = typia.createValidateEquals<MascaState>();

export const isValidCreateCredentialRequest = (
  input: any,
  account: string,
  state: MascaState
): asserts input is CreateCredentialRequestParams => {
  const res = validateCreateCredentialRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
  checkCredentialStore(input as CreateCredentialRequestParams, account, state);
};

export const isValidCreatePresentationRequest = (
  input: any
): asserts input is CreatePresentationRequestParams => {
  const res = validateCreatePresentationRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
  if (!(input as CreatePresentationRequestParams).vcs.length)
    throw new Error('invalid_argument: vcs');
};

export const isValidDeleteCredentialsRequest = (
  input: any,
  account: string,
  state: MascaState
): asserts input is DeleteCredentialsRequestParams => {
  const res = validateDeleteCredentialsRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
  checkCredentialStore(input as DeleteCredentialsRequestParams, account, state);
};

export const isValidQueryCredentialsRequest = (
  input: any,
  account: string,
  state: MascaState
): asserts input is QueryCredentialsRequestParams => {
  if (!input) return;
  const res = validateQueryCredentialsRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
  checkCredentialStore(input as QueryCredentialsRequestParams, account, state);
};

export const isValidResolveDIDRequest = (
  input: any
): asserts input is ResolveDIDRequestParams => {
  const res = validateResolveDIDRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
};

export const isValidSaveCredentialRequest = (
  input: any,
  account: string,
  state: MascaState
): asserts input is SaveCredentialRequestParams => {
  checkCredentialStore(input as SaveCredentialRequestParams, account, state);
  if (
    !(
      isW3CVerifiableCredential(input?.verifiableCredential) ||
      isW3CCredential(input?.verifiableCredential)
    )
  ) {
    throw new Error('invalid_argument: input.verifiableCredential');
  }
};

export const isValidSetCurrentAccountRequest = (
  input: any
): asserts input is SetCurrentAccountRequestParams => {
  const res = validateSetCurrentAccountRequest(input);
  if (!res.success) throw new Error(handleIValidation(res));
};

export const isValidSetCredentialStoreRequest = (
  input: any
): asserts input is SetCredentialStoreRequestParams => {
  const res = validateSetCredentialStoreRequest(input);
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

export const isValidImportStateBackupRequest = (
  input: any
): asserts input is ImportStateBackupRequestParams => {
  if (!input) return;
  if (!input.serializedState || typeof input.serializedState !== 'string')
    throw new Error('invalid_argument: input.serializedState');
};

export const isValidMascaState = (input: any): asserts input is MascaState => {
  const res = validateMascaState(input);
  if (!res.success) throw new Error(handleIValidation(res));
};
