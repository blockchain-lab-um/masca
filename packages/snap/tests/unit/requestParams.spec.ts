import {
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

import { account } from '../data/constants';
import * as exampleVCPayload from '../data/credentials/examplePayload.json';
import { getDefaultSnapState } from '../data/defaultSnapState';
import * as exampleVCLds from '../data/verifiable-credentials/exampleJSONLD.json';
import * as exampleVC2 from '../data/verifiable-credentials/exampleJWT_2.json';
import * as exampleVC from '../data/verifiable-credentials/exampleJWT.json';

describe('Utils [requestParams]', () => {
  describe('isValidResolveDIDRequest', () => {
    describe('success', () => {
      it('did string', () => {
        expect(() =>
          isValidResolveDIDRequest({ did: 'did:ethr:0x1234321' })
        ).not.toThrow(Error);
      });
    });
    describe('failure', () => {
      it('null', () => {
        expect(() => isValidResolveDIDRequest(null)).toThrow(Error);
      });
      it('wrong type', () => {
        expect(() => isValidResolveDIDRequest({ did: 123 })).toThrow(Error);
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
        ).not.toThrow(Error);
      });
      it('undefined', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            undefined,
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow(Error);
      });
      it('empty object', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            {},
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow(Error);
      });
      it('empty options object', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: {} },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow('Filter type is missing or not a string!');
      });
      it('options object with one store', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: { store: 'snap' } },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow('Filter type is missing or not a string!');
      });
      it('options object with multiple stores', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: { store: ['snap', 'ceramic'] } },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow('Filter type is missing or not a string!');
      });
      it('options object with wrong store', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: { store: ['snapp', 'ceramic'] } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.options.store[0]');
      });
      it('options object with wrong type store', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: { store: true } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.options.store');
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
        ).not.toThrow('Filter type is missing or not a string!');
      });
    });
    describe('failure', () => {
      it('store not enabled', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidQueryCredentialsRequest(
            { options: { store: 'ceramic' } },
            account,
            state
          )
        ).toThrow('Store ceramic is not enabled!');
      });
      it('object with empty filter object', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { filter: { type: 'abc', filter: {} } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.filter.type, $input.filter.filter');
      });
      it('filter without type', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { filter: { filter: {} } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.filter.type, $input.filter.filter');
      });
      it('filter with wrong type type', () => {
        expect(() =>
          isValidQueryCredentialsRequest(
            { filter: { type: 123, filter: {} } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.filter.type, $input.filter.filter');
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
        ).toThrow('invalid_argument: $input.options.returnStore');
      });
    });
  });

  describe('isValidSaveCredentialRequest', () => {
    describe('success', () => {
      it('valid vc with no options', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            { verifiableCredential: exampleVC },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow(Error);
      });
      it('valid vc with valid store', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            { verifiableCredential: exampleVC, options: { store: 'snap' } },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow(Error);
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
        ).toThrow(Error);
      });
      it('empty object', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            {},
            account,
            getDefaultSnapState(account)
          )
        ).toThrow(Error);
      });
      it('string', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            'infuraToken',
            account,
            getDefaultSnapState(account)
          )
        ).toThrow(Error);
      });
      it('number', () => {
        expect(() =>
          isValidSaveCredentialRequest(
            42,
            account,
            getDefaultSnapState(account)
          )
        ).toThrow(Error);
      });
      it('store not enabled', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidSaveCredentialRequest(
            { verifiableCredential: exampleVC, options: { store: 'ceramic' } },
            account,
            state
          )
        ).toThrow('Store ceramic is not enabled!');
      });
    });
  });

  describe('isValidCreatePresentationRequest', () => {
    describe('success', () => {
      it('2 vcs in array', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [exampleVC, exampleVC2],
          })
        ).not.toThrow();
      });
      // TODO fix, cannot create VP with only string vcId
      it.skip('all params are strings', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [{ id: 'test-id' }, { id: 'test-id-2' }],
          })
        ).not.toThrow();
      });
      it('request with proofFormat', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
          })
        ).not.toThrow();
      });
      it('request with proofFormat and empty proofOptions', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
            proofOptions: {},
          })
        ).not.toThrow();
      });
      it('request with proofFormat and proofOptions with domain and challenge', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
            proofOptions: { domain: 'test', challenge: 'test' },
          })
        ).not.toThrow();
      });
      // TODO fix test using ids for vcs
      it('complete request', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [exampleVCLds],
            proofFormat: 'lds',
            proofOptions: { type: 'Eth', domain: 'test', challenge: 'test' },
          })
        ).not.toThrow();
      });
    });
    describe('failure', () => {
      it('null', () => {
        expect(() => isValidCreatePresentationRequest(null)).toThrow(Error);
      });
      it('empty object', () => {
        expect(() => isValidCreatePresentationRequest({})).toThrow(Error);
      });
      it('string', () => {
        expect(() => isValidCreatePresentationRequest('infuraToken')).toThrow(
          Error
        );
      });
      it('number', () => {
        expect(() => isValidCreatePresentationRequest(42)).toThrow(Error);
      });
      it('vcs array is empty', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [],
          })
        ).toThrow(Error);
      });
      it('vcs is null', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: null,
          })
        ).toThrow('invalid_argument: $input.vcs');
      });
      it('proofFormat is wrong', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [exampleVC],
            proofFormat: 'wrong',
          })
        ).toThrow('invalid_argument: $input.proofFormat');
      });
      it('domain is not a string', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
            proofOptions: { domain: 123, challenge: 'test' },
          })
        ).toThrow('invalid_argument: $input.proofOptions.domain');
      });
      it('challenge is not a string', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
            proofOptions: { challenge: 123, domain: 'test' },
          })
        ).toThrow('invalid_argument: $input.proofOptions.challenge');
      });
      it('type is not a string', () => {
        expect(() =>
          isValidCreatePresentationRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
            proofOptions: { type: 123, challenge: 'test', domain: 'test' },
          })
        ).toThrow('invalid_argument: $input.proofOptions.type');
      });
    });
  });

  describe('isValidSwitchMethodRequest', () => {
    describe('success', () => {
      it('didMethod is a valid string', () => {
        expect(() =>
          isValidSwitchMethodRequest({ didMethod: 'did:ethr' })
        ).not.toThrow();
      });
    });
    describe('failure', () => {
      it('null', () => {
        expect(() => isValidSwitchMethodRequest(null)).toThrow(Error);
      });

      it('wrong string', () => {
        expect(() =>
          isValidSwitchMethodRequest({ didMethod: 'did:ethrr' })
        ).toThrow(Error);
      });
      it('empty object', () => {
        expect(() => isValidSwitchMethodRequest({})).toThrow(Error);
      });

      it('string', () => {
        expect(() => isValidSwitchMethodRequest('infuraToken')).toThrow(Error);
      });

      it('number', () => {
        expect(() => isValidSwitchMethodRequest(42)).toThrow(Error);
      });

      it('didMethod is null', () => {
        expect(() => isValidSwitchMethodRequest({ didMethod: null })).toThrow(
          Error
        );
      });

      it('didMethod is a number', () => {
        expect(() => isValidSwitchMethodRequest({ didMethod: 42 })).toThrow(
          Error
        );
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
        ).not.toThrow(Error);
      });
      // TODO skip until batch delete is implemented
      it.skip('list of string ids', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            { id: ['123', '456'] },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow(Error);
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
        ).not.toThrow(Error);
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
        ).not.toThrow(Error);
      });
    });
    describe('failure', () => {
      it('store not enabled', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidDeleteCredentialsRequest(
            { id: '123', options: { store: 'ceramic' } },
            account,
            state
          )
        ).toThrow('Store ceramic is not enabled!');
      });
      it('didMethod is a number', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            { didMethod: 42 },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow(Error);
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
        ).toThrow('invalid_argument: $input.id, $input.options.store');
      });
      it('list of not string ids', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            { id: ['123', 456] },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.id');
      });
      it('empty list of ids', () => {
        expect(() =>
          isValidDeleteCredentialsRequest(
            { id: [] },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.id');
      });
    });
  });

  describe('isValidCreateCredentialRequest', () => {
    describe('success', () => {
      it('only unsignedVC', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() => {
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: exampleVCPayload,
            },
            account,
            state
          );
        }).not.toThrow();
      });
      it('unsignedVC & PF', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: exampleVCPayload,
              proofFormat: 'jwt',
            },
            account,
            state
          )
        ).not.toThrow();
      });
      it('empty options', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: exampleVCPayload,
              proofFormat: 'jwt',
              options: {},
            },
            account,
            state
          )
        ).not.toThrow();
      });
      it('save option', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: exampleVCPayload,
              proofFormat: 'jwt',
              options: { save: true },
            },
            account,
            state
          )
        ).not.toThrow();
      });
      it('full options', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: exampleVCPayload,
              proofFormat: 'jwt',
              options: { save: true, store: ['snap'] },
            },
            account,
            state
          )
        ).not.toThrow();
      });
    });
    describe('failure', () => {
      it('store not enabled', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: exampleVCPayload,
              proofFormat: 'jwt',
              options: { save: true, store: 'ceramic' },
            },
            account,
            state
          )
        ).toThrow('Store ceramic is not enabled!');
      });
      it('invalid store', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: exampleVCPayload,
              proofFormat: 'jwt',
              options: { save: true, store: 'ceramicc' },
            },
            account,
            state
          )
        ).toThrow('invalid_argument: $input.options.store');
      });
      it('invalid proofFormat', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidCreateCredentialRequest(
            {
              minimalUnsignedCredential: exampleVCPayload,
              proofFormat: 'jws',
              options: { save: true, store: 'snap' },
            },
            account,
            state
          )
        ).toThrow('invalid_argument: $input.proofFormat');
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
        }).not.toThrow();
      });
    });
    describe('failure', () => {
      it('number', () => {
        expect(() =>
          isValidImportStateBackupRequest({
            serializedState: 2,
          })
        ).toThrow('invalid_argument: input.serializedState');
      });
    });
  });
  describe('isValidMascaState', () => {
    describe('success', () => {
      it('default snap state', () => {
        const state = getDefaultSnapState(account);
        expect(() => {
          isValidMascaState(state);
        }).not.toThrow();
      });
    });
    describe('failure', () => {
      it('empty object', () => {
        expect(() => isValidMascaState({})).toThrow(
          'invalid_argument: $input.accountState, $input.currentAccount, $input.snapConfig'
        );
      });
      it('null', () => {
        expect(() => isValidMascaState(null)).toThrow(
          'invalid_argument: $input'
        );
      });
      it('missing fields', () => {
        expect(() => isValidMascaState({ accountState: {} })).toThrow(
          'invalid_argument: $input.currentAccount, $input.snapConfig'
        );
      });
    });
  });
});
