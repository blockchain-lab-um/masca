import {
  isValidCreateVCRequest,
  isValidCreateVPRequest,
  isValidDeleteVCsRequest,
  isValidQueryVCsRequest,
  isValidResolveDIDRequest,
  isValidSaveVCRequest,
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

  describe('isValidQueryVCsRequest', () => {
    describe('success', () => {
      it('null', () => {
        expect(() =>
          isValidQueryVCsRequest(null, account, getDefaultSnapState(account))
        ).not.toThrow(Error);
      });
      it('undefined', () => {
        expect(() =>
          isValidQueryVCsRequest(
            undefined,
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow(Error);
      });
      it('empty object', () => {
        expect(() =>
          isValidQueryVCsRequest({}, account, getDefaultSnapState(account))
        ).not.toThrow(Error);
      });
      it('empty options object', () => {
        expect(() =>
          isValidQueryVCsRequest(
            { options: {} },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow('Filter type is missing or not a string!');
      });
      it('options object with one store', () => {
        expect(() =>
          isValidQueryVCsRequest(
            { options: { store: 'snap' } },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow('Filter type is missing or not a string!');
      });
      it('options object with multiple stores', () => {
        expect(() =>
          isValidQueryVCsRequest(
            { options: { store: ['snap', 'ceramic'] } },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow('Filter type is missing or not a string!');
      });
      it('options object with wrong store', () => {
        expect(() =>
          isValidQueryVCsRequest(
            { options: { store: ['snapp', 'ceramic'] } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.options.store[0]');
      });
      it('options object with wrong type store', () => {
        expect(() =>
          isValidQueryVCsRequest(
            { options: { store: true } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.options.store');
      });
      it('options object with multiple stores and returnStore', () => {
        expect(() =>
          isValidQueryVCsRequest(
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
          isValidQueryVCsRequest(
            { options: { store: 'ceramic' } },
            account,
            state
          )
        ).toThrow('Store ceramic is not enabled!');
      });
      it('object with empty filter object', () => {
        expect(() =>
          isValidQueryVCsRequest(
            { filter: { type: 'abc', filter: {} } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.filter.type, $input.filter.filter');
      });
      it('filter without type', () => {
        expect(() =>
          isValidQueryVCsRequest(
            { filter: { filter: {} } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.filter.type, $input.filter.filter');
      });
      it('filter with wrong type type', () => {
        expect(() =>
          isValidQueryVCsRequest(
            { filter: { type: 123, filter: {} } },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.filter.type, $input.filter.filter');
      });
      it('options object with multiple stores and wrong type returnStore', () => {
        expect(() =>
          isValidQueryVCsRequest(
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

  describe('isValidSaveVCRequest', () => {
    describe('success', () => {
      it('valid vc with no options', () => {
        expect(() =>
          isValidSaveVCRequest(
            { verifiableCredential: exampleVC },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow(Error);
      });
      it('valid vc with valid store', () => {
        expect(() =>
          isValidSaveVCRequest(
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
          isValidSaveVCRequest(null, account, getDefaultSnapState(account))
        ).toThrow(Error);
      });
      it('empty object', () => {
        expect(() =>
          isValidSaveVCRequest({}, account, getDefaultSnapState(account))
        ).toThrow(Error);
      });
      it('string', () => {
        expect(() =>
          isValidSaveVCRequest(
            'infuraToken',
            account,
            getDefaultSnapState(account)
          )
        ).toThrow(Error);
      });
      it('number', () => {
        expect(() =>
          isValidSaveVCRequest(42, account, getDefaultSnapState(account))
        ).toThrow(Error);
      });
      it('store not enabled', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() =>
          isValidSaveVCRequest(
            { verifiableCredential: exampleVC, options: { store: 'ceramic' } },
            account,
            state
          )
        ).toThrow('Store ceramic is not enabled!');
      });
    });
  });

  describe('isValidCreateVPRequest', () => {
    describe('success', () => {
      it('2 vcs in array', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: [exampleVC, exampleVC2],
          })
        ).not.toThrow();
      });
      // TODO fix, cannot create VP with only string vcId
      it.skip('all params are strings', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: [{ id: 'test-id' }, { id: 'test-id-2' }],
          })
        ).not.toThrow();
      });
      it('request with proofFormat', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
          })
        ).not.toThrow();
      });
      it('request with proofFormat and empty proofOptions', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
            proofOptions: {},
          })
        ).not.toThrow();
      });
      it('request with proofFormat and proofOptions with domain and challenge', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
            proofOptions: { domain: 'test', challenge: 'test' },
          })
        ).not.toThrow();
      });
      // TODO fix test using ids for vcs
      it('complete request', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: [exampleVCLds],
            proofFormat: 'lds',
            proofOptions: { type: 'Eth', domain: 'test', challenge: 'test' },
          })
        ).not.toThrow();
      });
    });
    describe('failure', () => {
      it('null', () => {
        expect(() => isValidCreateVPRequest(null)).toThrow(Error);
      });
      it('empty object', () => {
        expect(() => isValidCreateVPRequest({})).toThrow(Error);
      });
      it('string', () => {
        expect(() => isValidCreateVPRequest('infuraToken')).toThrow(Error);
      });
      it('number', () => {
        expect(() => isValidCreateVPRequest(42)).toThrow(Error);
      });
      it('vcs array is empty', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: [],
          })
        ).toThrow(Error);
      });
      it('vcs is null', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: null,
          })
        ).toThrow('invalid_argument: $input.vcs');
      });
      it('proofFormat is wrong', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: [exampleVC],
            proofFormat: 'wrong',
          })
        ).toThrow('invalid_argument: $input.proofFormat');
      });
      it('domain is not a string', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
            proofOptions: { domain: 123, challenge: 'test' },
          })
        ).toThrow('invalid_argument: $input.proofOptions.domain');
      });
      it('challenge is not a string', () => {
        expect(() =>
          isValidCreateVPRequest({
            vcs: [exampleVC],
            proofFormat: 'jwt',
            proofOptions: { challenge: 123, domain: 'test' },
          })
        ).toThrow('invalid_argument: $input.proofOptions.challenge');
      });
      it('type is not a string', () => {
        expect(() =>
          isValidCreateVPRequest({
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

  describe('isValidDeleteVCsRequest', () => {
    describe('success', () => {
      it('string id', () => {
        expect(() =>
          isValidDeleteVCsRequest(
            { id: '123' },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow(Error);
      });
      // TODO skip until batch delete is implemented
      it.skip('list of string ids', () => {
        expect(() =>
          isValidDeleteVCsRequest(
            { id: ['123', '456'] },
            account,
            getDefaultSnapState(account)
          )
        ).not.toThrow(Error);
      });
      // TODO skip until batch delete is implemented
      it.skip('list of string ids and store', () => {
        expect(() =>
          isValidDeleteVCsRequest(
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
          isValidDeleteVCsRequest(
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
          isValidDeleteVCsRequest(
            { id: '123', options: { store: 'ceramic' } },
            account,
            state
          )
        ).toThrow('Store ceramic is not enabled!');
      });
      it('didMethod is a number', () => {
        expect(() =>
          isValidDeleteVCsRequest(
            { didMethod: 42 },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow(Error);
      });
      it('list of string ids and wrong store', () => {
        expect(() =>
          isValidDeleteVCsRequest(
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
          isValidDeleteVCsRequest(
            { id: ['123', 456] },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.id');
      });
      it('empty list of ids', () => {
        expect(() =>
          isValidDeleteVCsRequest(
            { id: [] },
            account,
            getDefaultSnapState(account)
          )
        ).toThrow('invalid_argument: $input.id');
      });
    });
  });

  describe('isValidCreateVCRequest', () => {
    describe('success', () => {
      it('only unsignedVC', () => {
        const state = getDefaultSnapState(account);
        state.accountState[account].accountConfig.ssi.vcStore.ceramic = false;
        expect(() => {
          isValidCreateVCRequest(
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
          isValidCreateVCRequest(
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
          isValidCreateVCRequest(
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
          isValidCreateVCRequest(
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
          isValidCreateVCRequest(
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
          isValidCreateVCRequest(
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
          isValidCreateVCRequest(
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
          isValidCreateVCRequest(
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
});
