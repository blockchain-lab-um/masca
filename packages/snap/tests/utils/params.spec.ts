import {
  address,
  exampleVC,
  getDefaultSnapState,
} from '../testUtils/constants';
import {
  isValidCreateVPRequest,
  isValidDeleteVCRequest,
  isValidQueryRequest,
  isValidResolveDIDRequest,
  isValidSaveVCRequest,
  isValidSwitchMethodRequest,
} from '../../src/utils/params';

describe('Utils [params]', () => {
  /*
    isValidGetVCsRequest
  */
  describe('isValidGetVCsRequest', () => {
    // TODO
  });
  describe('isValidResolveDIDRequest', () => {
    it('should fail for null', () => {
      expect(() => isValidResolveDIDRequest(null)).toThrow(Error);
    });
  });

  describe('isValidQueryRequest', () => {
    it('should fail for not enabled store', () => {
      const state = getDefaultSnapState();
      state.accountState[address].accountConfig.ssi.vcStore.ceramic = false;
      expect(() =>
        isValidQueryRequest({ options: { store: 'ceramic' } }, address, state)
      ).toThrow('Store is not enabled!');
    });
    it('should not fail for null', () => {
      expect(() =>
        isValidQueryRequest(null, address, getDefaultSnapState())
      ).not.toThrow(Error);
    });
    it('should not fail for undefined', () => {
      expect(() =>
        isValidQueryRequest(undefined, address, getDefaultSnapState())
      ).not.toThrow(Error);
    });
    it('should not fail for empty object', () => {
      expect(() =>
        isValidQueryRequest({}, address, getDefaultSnapState())
      ).not.toThrow(Error);
    });
    it('should not fail for object with filter', () => {
      expect(() =>
        isValidQueryRequest(
          { filter: { type: 'abc', filter: {} } },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow(Error);
    });
    it('should fail for filter without type', () => {
      expect(() =>
        isValidQueryRequest(
          { filter: { filter: {} } },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Filter type is missing or not a string!');
    });
    it('should fail for filter with wrong type type', () => {
      expect(() =>
        isValidQueryRequest(
          { filter: { type: 123, filter: {} } },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Filter type is missing or not a string!');
    });
    it('should not fail for empty options object', () => {
      expect(() =>
        isValidQueryRequest({ options: {} }, address, getDefaultSnapState())
      ).not.toThrow('Filter type is missing or not a string!');
    });
    it('should not fail for options object with one store', () => {
      expect(() =>
        isValidQueryRequest(
          { options: { store: 'snap' } },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow('Filter type is missing or not a string!');
    });
    it('should not fail for options object with multiple stores', () => {
      expect(() =>
        isValidQueryRequest(
          { options: { store: ['snap', 'ceramic'] } },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow('Filter type is missing or not a string!');
    });
    it('should not fail for options object with wrong store', () => {
      expect(() =>
        isValidQueryRequest(
          { options: { store: ['snapp', 'ceramic'] } },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Store is not supported!');
    });
    it('should not fail for options object with wrong type store', () => {
      expect(() =>
        isValidQueryRequest(
          { options: { store: true } },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Store is invalid format');
    });
    it('should not fail for options object with multiple stores and returnStore', () => {
      expect(() =>
        isValidQueryRequest(
          {
            options: { store: ['snap', 'ceramic'], returnStore: false },
          },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow('Filter type is missing or not a string!');
    });
    it('should fail for options object with multiple stores and wrong type returnStore', () => {
      expect(() =>
        isValidQueryRequest(
          {
            options: { store: ['snap', 'ceramic'], returnStore: 123 },
          },
          address,
          getDefaultSnapState()
        )
      ).toThrow('ReturnStore is invalid format');
    });
  });

  /*
    isValidSaveVCRequest
  */
  describe('isValidSaveVCRequest', () => {
    it('should fail for null', () => {
      expect(() =>
        isValidSaveVCRequest(null, address, getDefaultSnapState())
      ).toThrow(Error);
    });

    it('should fail for empty object', () => {
      expect(() =>
        isValidSaveVCRequest({}, address, getDefaultSnapState())
      ).toThrow(Error);
    });

    it('should fail for string', () => {
      expect(() =>
        isValidSaveVCRequest('infuraToken', address, getDefaultSnapState())
      ).toThrow(Error);
    });

    it('should fail for number', () => {
      expect(() =>
        isValidSaveVCRequest(42, address, getDefaultSnapState())
      ).toThrow(Error);
    });
    it('should fail for not enabled store', () => {
      const state = getDefaultSnapState();
      state.accountState[address].accountConfig.ssi.vcStore.ceramic = false;
      expect(() =>
        isValidSaveVCRequest(
          { verifiableCredential: exampleVC, options: { store: 'ceramic' } },
          address,
          state
        )
      ).toThrow('Store is not enabled!');
    });
  });

  /*
    isValidGetVPRequest
  */
  describe('isValidCreateVPRequest', () => {
    it('should fail for not enabled store', () => {
      const state = getDefaultSnapState();
      state.accountState[address].accountConfig.ssi.vcStore.ceramic = false;
      expect(() =>
        isValidCreateVPRequest(
          { vcs: [{ id: '123', metadata: { store: 'ceramic' } }] },
          address,
          state
        )
      ).toThrow('Store is not enabled!');
    });
    it('should succeed if vcId is a string', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id' }, { id: 'test-id-2' }],
          },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow();
    });

    it('should succeed if all params are strings', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id' }, { id: 'test-id-2' }],
          },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow();
    });

    it('should fail for null', () => {
      expect(() =>
        isValidCreateVPRequest(null, address, getDefaultSnapState())
      ).toThrow(Error);
    });

    it('should fail for empty object', () => {
      expect(() =>
        isValidCreateVPRequest({}, address, getDefaultSnapState())
      ).toThrow(Error);
    });

    it('should fail for string', () => {
      expect(() =>
        isValidCreateVPRequest('infuraToken', address, getDefaultSnapState())
      ).toThrow(Error);
    });

    it('should fail for number', () => {
      expect(() =>
        isValidCreateVPRequest(42, address, getDefaultSnapState())
      ).toThrow(Error);
    });

    it('should fail if vcs array is empty', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [],
          },
          address,
          getDefaultSnapState()
        )
      ).toThrow(Error);
    });

    it('should fail if vcId is a number', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 123 }],
          },
          address,
          getDefaultSnapState()
        )
      ).toThrow('VC is invalid format');
    });
    it('should fail if vcs is null', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: null,
          },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Invalid CreateVP request');
    });
    it('should fail if proofFormat is wrong', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id' }],
            proofFormat: 'wrong',
          },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Proof format not supported');
    });
    it('should not throw request with proofFormat and options', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id', metadata: {} }],
            proofFormat: 'jwt',
          },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow('err');
    });
    it('should not throw request with proofFormat and options and metadata', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
            proofFormat: 'jwt',
          },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow('err');
    });
    it('should throw request with wrong store', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id', metadata: { store: 'snapp' } }],
            proofFormat: 'jwt',
          },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Store is not supported!');
    });

    it('should not throw request with proofFormat and proofOptions', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
            proofFormat: 'jwt',
            proofOptions: {},
          },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow('Store is not supported!');
    });
    it('should not throw request with proofFormat and proofOptions with domain and challenge', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
            proofFormat: 'jwt',
            proofOptions: { domain: 'test', challenge: 'test' },
          },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow('Store is not supported!');
    });
    it('should throw domain is not a string', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
            proofFormat: 'jwt',
            proofOptions: { domain: 123, challenge: 'test' },
          },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Domain is not a string');
    });
    it('should throw challenge is not a string', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
            proofFormat: 'jwt',
            proofOptions: { challenge: 123, domain: 'test' },
          },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Challenge is not a string');
    });
    it('should throw type is not a string', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
            proofFormat: 'jwt',
            proofOptions: { type: 123, challenge: 'test', domain: 'test' },
          },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Type is not a string');
    });
    it('should not throw complete request', () => {
      expect(() =>
        isValidCreateVPRequest(
          {
            vcs: [
              { id: 'test-id', metadata: { store: 'snap' } },
              { id: 'test-id', metadata: { store: 'ceramic' } },
              { id: 'test-id' },
              { id: 'test-id', metadata: {} },
            ],
            proofFormat: 'lds',
            proofOptions: { type: 'Eth', domain: 'test', challenge: 'test' },
          },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow('Store is not supported!');
    });
  });

  /*
    isValidSwitchMethodRequest
  */
  describe('isValidSwitchMethodRequest', () => {
    it('should succeed if didMethod is a valid string', () => {
      expect(() =>
        isValidSwitchMethodRequest({ didMethod: 'did:ethr' })
      ).not.toThrow();
    });

    it('should fail for null', () => {
      expect(() => isValidSwitchMethodRequest(null)).toThrow(Error);
    });

    it('should fail for wrong string', () => {
      expect(() =>
        isValidSwitchMethodRequest({ didMethod: 'did:ethrr' })
      ).toThrow(Error);
    });
    it('should fail for empty object', () => {
      expect(() => isValidSwitchMethodRequest({})).toThrow(Error);
    });

    it('should fail for string', () => {
      expect(() => isValidSwitchMethodRequest('infuraToken')).toThrow(Error);
    });

    it('should fail for number', () => {
      expect(() => isValidSwitchMethodRequest(42)).toThrow(Error);
    });

    it('should fail if didMethod is null', () => {
      expect(() => isValidSwitchMethodRequest({ didMethod: null })).toThrow(
        Error
      );
    });

    it('should fail if didMethod is a number', () => {
      expect(() => isValidSwitchMethodRequest({ didMethod: 42 })).toThrow(
        Error
      );
    });
  });
  describe('isValidDeleteVCsRequest', () => {
    it('should fail for not enabled store', () => {
      const state = getDefaultSnapState();
      state.accountState[address].accountConfig.ssi.vcStore.ceramic = false;
      expect(() =>
        isValidDeleteVCRequest(
          { id: '123', options: { store: 'ceramic' } },
          address,
          state
        )
      ).toThrow('Store is not enabled!');
    });
    it('should fail if didMethod is a number', () => {
      expect(() =>
        isValidDeleteVCRequest(
          { didMethod: 42 },
          address,
          getDefaultSnapState()
        )
      ).toThrow(Error);
    });
    it('should not throw for string id', () => {
      expect(() =>
        isValidDeleteVCRequest({ id: '123' }, address, getDefaultSnapState())
      ).not.toThrow(Error);
    });
    it('should not throw for list of string ids', () => {
      expect(() =>
        isValidDeleteVCRequest(
          { id: ['123', '456'] },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow(Error);
    });
    it('should not throw for list of string ids and store', () => {
      expect(() =>
        isValidDeleteVCRequest(
          {
            id: ['123', '456'],
            options: { store: 'snap' },
          },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow(Error);
    });
    it('should not throw for list of string ids and list of stores', () => {
      expect(() =>
        isValidDeleteVCRequest(
          {
            id: ['123', '456'],
            options: { store: ['snap', 'ceramic'] },
          },
          address,
          getDefaultSnapState()
        )
      ).not.toThrow(Error);
    });
    it('should  throw for list of string ids and wrong store', () => {
      expect(() =>
        isValidDeleteVCRequest(
          {
            id: ['123', '456'],
            options: { store: 'snapp' },
          },
          address,
          getDefaultSnapState()
        )
      ).toThrow('Store is not supported!');
    });
    it('should  throw for list of not string ids', () => {
      expect(() =>
        isValidDeleteVCRequest(
          { id: ['123', 456] },
          address,
          getDefaultSnapState()
        )
      ).toThrow('ID is not a string or array of strings');
    });
    it('should  throw for empty list of ids', () => {
      expect(() =>
        isValidDeleteVCRequest({ id: [] }, address, getDefaultSnapState())
      ).toThrow('ID is not a string or array of strings');
    });
  });
});
