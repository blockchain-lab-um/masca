import {
  CURRENT_STATE_VERSION,
  isValidCreateCredentialRequest,
  isValidCreatePresentationRequest,
  isValidDeleteCredentialsRequest,
  isValidImportStateBackupRequest,
  isValidMascaState,
  isValidQueryCredentialsRequest,
  isValidResolveDIDRequest,
  isValidSaveCredentialRequest,
  isValidSwitchMethodRequest,
} from '@blockchain-lab-um/masca-types';
import { describe, expect, it } from 'vitest';

import { account } from '../data/constants';
import { EXAMPLE_VC_PAYLOAD } from '../data/credentials';
import { getDefaultSnapState } from '../data/defaultSnapState';
import {
  EXAMPLE_VC,
  EXAMPLE_VC2,
  EXAMPLE_VC_LDS,
} from '../data/verifiable-credentials';

describe('Utils [requestParams]', () => {
  describe('isValidResolveDIDRequest', () => {
    describe('success', () => {
      it('did string', () => {
        expect(() =>
          isValidResolveDIDRequest({ did: 'did:ethr:0x1234321' })
        ).not.toThrowError();
      });
    });
    describe('failure', () => {
      it('null', () => {
        expect(() => isValidResolveDIDRequest(null)).toThrowError();
      });
      it('wrong type', () => {
        expect(() => isValidResolveDIDRequest({ did: 123 })).toThrowError();
      });
    });
  });

  describe('isValidQueryCredentialsRequest', () => {
    describe('success', () => {
      it('null', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            null,
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError();
      });
      it('undefined', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            undefined,
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError();
      });
      it('empty object', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            {},
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError();
      });
      it('empty options object', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: {} },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError('Filter type is missing or not a string!');
      });
      it('options object with one store', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: { store: 'snap' } },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError('Filter type is missing or not a string!');
      });
      it('options object with multiple stores', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: { store: ['snap', 'ceramic'] } },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError('Filter type is missing or not a string!');
      });
      it('options object with wrong store', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: { store: ['snapp', 'ceramic'] } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError('invalid_argument: $input.options.store[0]');
      });
      it('options object with wrong type store', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: { store: true } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError('invalid_argument: $input.options.store');
      });
      it('options object with multiple stores and returnStore', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            {
              options: { store: ['snap', 'ceramic'], returnStore: false },
            },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError('Filter type is missing or not a string!');
      });
    });
    describe('failure', () => {
      it('store not enabled', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: { store: 'ceramic' } },
            account,
            state
          )
        ).toThrowError('Store ceramic is not enabled!');
      });
      it('object with empty filter object', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { filter: { type: 'abc', filter: {} } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError(
          'invalid_argument: $input.filter.type, $input.filter.filter'
        );
      });
      it('filter without type', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { filter: { filter: {} } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError(
          'invalid_argument: $input.filter.type, $input.filter.filter'
        );
      });
      it('filter with wrong type type', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { filter: { type: 123, filter: {} } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError(
          'invalid_argument: $input.filter.type, $input.filter.filter'
        );
      });
      it('options object with multiple stores and wrong type returnStore', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            {
              options: { store: ['snap', 'ceramic'], returnStore: 123 },
            },
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError('invalid_argument: $input.options.returnStore');
      });
    });
  });

  describe('isValidSaveCredentialRequest', () => {
    describe('success', () => {
      it('valid vc with no options', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            { verifiableCredential: EXAMPLE_VC },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError();
      });
      it('valid vc with valid store', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            { verifiableCredential: EXAMPLE_VC, options: { store: 'snap' } },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError();
      });
    });
    describe('failure', () => {
      it('null', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            null,
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError();
      });
      it('empty object', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            {},
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError();
      });
      it('string', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            'infuraToken',
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError();
      });
      it('number', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            42,
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError();
      });
      it('store not enabled', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() =>
          isValidSaveCredentialRequest(
            { verifiableCredential: EXAMPLE_VC, options: { store: 'ceramic' } },
            account,
            state
          )
        ).toThrowError('Store ceramic is not enabled!');
      });
    });
  });

  describe('isValidCreatePresentationRequest', () => {
    describe('success', () => {
      it('2 vcs in array', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [EXAMPLE_VC, EXAMPLE_VC2],
          })
        ).not.toThrowError();
      });
      // TODO fix, cannot create VP with only string vcId
      it.skip('all params are strings', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [{ id: 'test-id' }, { id: 'test-id-2' }],
          })
        ).not.toThrowError();
      });
      it('request with proofFormat', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [EXAMPLE_VC],
            proofFormat: 'jwt',
          })
        ).not.toThrowError();
      });
      it('request with proofFormat and empty proofOptions', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [EXAMPLE_VC2],
            proofFormat: 'jwt',
            proofOptions: {},
          })
        ).not.toThrowError();
      });
      it('request with proofFormat and proofOptions with domain and challenge', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [EXAMPLE_VC],
            proofFormat: 'jwt',
            proofOptions: { domain: 'test', challenge: 'test' },
          })
        ).not.toThrowError();
      });
      // TODO fix test using ids for vcs
      it('complete request', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [EXAMPLE_VC_LDS],
            proofFormat: 'lds',
            proofOptions: { type: 'Eth', domain: 'test', challenge: 'test' },
          })
        ).not.toThrowError();
      });
    });
    describe('failure', () => {
      it('null', () => {
        expect(() => isValidCreatePresentationRequest(null)).toThrowError();
      });
      it('empty object', () => {
        expect(() => isValidCreatePresentationRequest({})).toThrowError();
      });
      it('string', () => {
        expect(() =>
          isValidCreatePresentationRequest('infuraToken')
        ).toThrowError(Error);
      });
      it('number', () => {
        expect(() => isValidCreatePresentationRequest(42)).toThrowError();
      });
      it('vcs array is empty', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [],
          })
        ).toThrowError();
      });
      it('vcs is null', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: null,
          })
        ).toThrowError('invalid_argument: $input.vcs');
      });
      it('proofFormat is wrong', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [EXAMPLE_VC],
            proofFormat: 'wrong',
          })
        ).toThrowError('invalid_argument: $input.proofFormat');
      });
      it('domain is not a string', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [EXAMPLE_VC],
            proofFormat: 'jwt',
            proofOptions: { domain: 123, challenge: 'test' },
          })
        ).toThrowError('invalid_argument: $input.proofOptions.domain');
      });
      it('challenge is not a string', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [EXAMPLE_VC],
            proofFormat: 'jwt',
            proofOptions: { challenge: 123, domain: 'test' },
          })
        ).toThrowError('invalid_argument: $input.proofOptions.challenge');
      });
      it('type is not a string', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [EXAMPLE_VC],
            proofFormat: 'jwt',
            proofOptions: { type: 123, challenge: 'test', domain: 'test' },
          })
        ).toThrowError('invalid_argument: $input.proofOptions.type');
      });
    });
  });

  describe('isValidSwitchMethodRequest', () => {
    describe('success', () => {
      it('didMethod is a valid string', () => {
        expect(() =>
          isValidSwitchMethodRequest({ didMethod: 'did:ethr' })
        ).not.toThrowError();
      });
    });
    describe('failure', () => {
      it('null', () => {
        expect(() => isValidSwitchMethodRequest(null)).toThrowError();
      });

      it('wrong string', () => {
        expect(() =>
          isValidSwitchMethodRequest({ didMethod: 'did:ethrr' })
        ).toThrowError();
      });
      it('empty object', () => {
        expect(() => isValidSwitchMethodRequest({})).toThrowError();
      });

      it('string', () => {
        expect(() => isValidSwitchMethodRequest('infuraToken')).toThrowError();
      });

      it('number', () => {
        expect(() => isValidSwitchMethodRequest(42)).toThrowError();
      });

      it('didMethod is null', () => {
        expect(() =>
          isValidSwitchMethodRequest({ didMethod: null })
        ).toThrowError(Error);
      });

      it('didMethod is a number', () => {
        expect(() =>
          isValidSwitchMethodRequest({ didMethod: 42 })
        ).toThrowError(Error);
      });
    });
  });

  describe('isValidDeleteCredentialsRequest', () => {
    describe('success', () => {
      it('string id', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            { id: '123' },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError();
      });
      // TODO skip until batch delete is implemented
      it.skip('list of string ids', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            { id: ['123', '456'] },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError();
      });
      // TODO skip until batch delete is implemented
      it.skip('list of string ids and store', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            {
              id: ['123', '456'],
              options: { store: 'snap' },
            },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError();
      });
      // TODO skip until batch delete is implemented
      it.skip('list of string ids and list of stores', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            {
              id: ['123', '456'],
              options: { store: ['snap', 'ceramic'] },
            },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrowError();
      });
    });
    describe('failure', () => {
      it('store not enabled', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() =>
          isValidDeleteCredentialsRequest(
            { id: '123', options: { store: 'ceramic' } },
            account,
            state
          )
        ).toThrowError('Store ceramic is not enabled!');
      });
      it('didMethod is a number', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            { didMethod: 42 },
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError();
      });
      it('list of string ids and wrong store', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            {
              id: ['123', '456'],
              options: { store: 'snapp' },
            },
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError('invalid_argument: $input.id, $input.options.store');
      });
      it('list of not string ids', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            { id: ['123', 456] },
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError('invalid_argument: $input.id');
      });
      it('empty list of ids', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            { id: [] },
            account,
            getDefaultSnapState(account)
          )
        ).toThrowError('invalid_argument: $input.id');
      });
    });
  });

  describe('isValidCreateCredentialRequest', () => {
    describe('success', () => {
      it('only unsignedVC', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() => {
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
            },
            account,
            state
          );
        }).not.toThrowError();
      });
      it('unsignedVC & PF', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
              proofFormat: 'jwt',
            },
            account,
            state
          )
        ).not.toThrowError();
      });
      it('empty options', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
              proofFormat: 'jwt',
              options: {},
            },
            account,
            state
          )
        ).not.toThrowError();
      });
      it('save option', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
              proofFormat: 'jwt',
              options: { save: true },
            },
            account,
            state
          )
        ).not.toThrowError();
      });
      it('full options', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
              proofFormat: 'jwt',
              options: { save: true, store: ['snap'] },
            },
            account,
            state
          )
        ).not.toThrowError();
      });
    });
    describe('failure', () => {
      it('store not enabled', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
              proofFormat: 'jwt',
              options: { save: true, store: 'ceramic' },
            },
            account,
            state
          )
        ).toThrowError('Store ceramic is not enabled!');
      });
      it('invalid store', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
              proofFormat: 'jwt',
              options: { save: true, store: 'ceramicc' },
            },
            account,
            state
          )
        ).toThrowError('invalid_argument: $input.options.store');
      });
      it('invalid proofFormat', () => {
        const state = getDefaultSnapState(account);
        state[CURRENT_STATE_VERSION].accountState[
          account
        ].general.account.ssi.storesEnabled.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: EXAMPLE_VC_PAYLOAD,
              proofFormat: 'jws',
              options: { save: true, store: 'snap' },
            },
            account,
            state
          )
        ).toThrowError('invalid_argument: $input.proofFormat');
      });
    });
  });
  describe('isValidImportStateBackupRequest', () => {
    describe('success', () => {
      it('string', () => {
        expect(() => {
          isValidImportStateBackupRequest({
            serializedState: 'test',
          });
        }).not.toThrowError();
      });
    });
    describe('failure', () => {
      it('number', () => {
        expect(() =>
          isValidImportStateBackupRequest({
            serializedState: 2,
          })
        ).toThrowError('invalid_argument: input.serializedState');
      });
    });
  });
  describe('isValidMascaState', () => {
    describe('success', () => {
      it('default snap state', () => {
        const state = getDefaultSnapState(account);
        expect(() => {
          isValidMascaState(state);
        }).not.toThrowError();
      });
    });
    describe('failure', () => {
      it('empty object', () => {
        expect(() => isValidMascaState({})).toThrowError(
          'invalid_argument: $input.v1'
        );
      });
      it('empty state with version', () => {
        expect(() => isValidMascaState({ v1: {} })).toThrowError(
          'invalid_argument: $input.v1.accountState, $input.v1.currentAccount, $input.v1.config'
        );
      });
      it('null', () => {
        expect(() => isValidMascaState(null)).toThrowError(
          'invalid_argument: $input'
        );
      });
      it('missing fields', () => {
        expect(() =>
          isValidMascaState({ v1: { accountState: {} } })
        ).toThrowError(
          'invalid_argument: $input.v1.currentAccount, $input.v1.config'
        );
      });
    });
  });
});
