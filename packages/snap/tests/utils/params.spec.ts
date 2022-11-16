import { exampleVC } from '../testUtils/constants';
import {
  isValidChangeInfuraTokenRequest,
  isValidCreateVPRequest,
  isValidDeleteVCRequest,
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

  /*
    isValidSaveVCRequest
  */
  describe('isValidSaveVCRequest', () => {
    it('should fail for null', () => {
      expect(() => isValidSaveVCRequest(null)).toThrow(Error);
    });

    it('should fail for empty object', () => {
      expect(() => isValidSaveVCRequest({})).toThrow(Error);
    });

    it('should fail for string', () => {
      expect(() => isValidSaveVCRequest('infuraToken')).toThrow(Error);
    });

    it('should fail for number', () => {
      expect(() => isValidSaveVCRequest(42)).toThrow(Error);
    });
    it('should not throw for vc', () => {
      expect(() =>
        isValidSaveVCRequest({ verifiableCredential: exampleVC })
      ).not.toThrow(Error);
    });
    it('should not throw for vc with store snap', () => {
      expect(() =>
        isValidSaveVCRequest({ verifiableCredential: exampleVC, store: 'snap' })
      ).not.toThrow(Error);
    });
    it('should not throw for vc with store ceramic', () => {
      expect(() =>
        isValidSaveVCRequest({
          verifiableCredential: exampleVC,
          store: 'ceramic',
        })
      ).not.toThrow(Error);
    });
    it('should  throw for vc with wrong store', () => {
      expect(() =>
        isValidSaveVCRequest({
          verifiableCredential: exampleVC,
          store: 'snapp',
        })
      ).toThrow('Store is not supported!');
    });
  });

  /*
    isValidChangeInfuraTokenRequest
  */
  describe('isValidChangeInfuraTokenRequest', () => {
    it('should succeed if infuraToken is a string', () => {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: 'Valid infura token' })
      ).not.toThrow();
    });

    it('should fail for null', () => {
      expect(() => isValidChangeInfuraTokenRequest(null)).toThrow(Error);
    });

    it('should fail for empty object', () => {
      expect(() => isValidChangeInfuraTokenRequest({})).toThrow(Error);
    });

    it('should fail for string', () => {
      expect(() => isValidChangeInfuraTokenRequest('infuraToken')).toThrow(
        Error
      );
    });

    it('should fail for number', () => {
      expect(() => isValidChangeInfuraTokenRequest(42)).toThrow(Error);
    });

    it('should fail if infuraToken is null', () => {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: null })
      ).toThrow(Error);
    });

    it('should fail if infuraToken is a number', () => {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: 42 })
      ).toThrow(Error);
    });
  });

  /*
    isValidGetVPRequest
  */
  describe('isValidCreateVPRequest', () => {
    it('should succeed if vcId is a string', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id' }, { id: 'test-id-2' }],
        })
      ).not.toThrow();
    });

    it('should succeed if all params are strings', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id' }, { id: 'test-id-2' }],
        })
      ).not.toThrow();
    });

    it('should fail for null', () => {
      expect(() => isValidCreateVPRequest(null)).toThrow(Error);
    });

    it('should fail for empty object', () => {
      expect(() => isValidCreateVPRequest({})).toThrow(Error);
    });

    it('should fail for string', () => {
      expect(() => isValidCreateVPRequest('infuraToken')).toThrow(Error);
    });

    it('should fail for number', () => {
      expect(() => isValidCreateVPRequest(42)).toThrow(Error);
    });

    it('should fail if vcs array is empty', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [],
        })
      ).toThrow(Error);
    });

    it('should fail if vcId is a number', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 123 }],
        })
      ).toThrow('VC is invalid format');
    });
    it('should fail if vcs is null', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: null,
        })
      ).toThrow('Invalid CreateVP request');
    });
    it('should fail if proofFormat is wrong', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id' }],
          proofFormat: 'wrong',
        })
      ).toThrow('Proof format not supported');
    });
    it('should not throw request with proofFormat and options', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id', metadata: {} }],
          proofFormat: 'jwt',
        })
      ).not.toThrow('err');
    });
    it('should not throw request with proofFormat and options and metadata', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
          proofFormat: 'jwt',
        })
      ).not.toThrow('err');
    });
    it('should throw request with wrong store', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id', metadata: { store: 'snapp' } }],
          proofFormat: 'jwt',
        })
      ).toThrow('Store is not supported!');
    });

    it('should not throw request with proofFormat and proofOptions', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
          proofFormat: 'jwt',
          proofOptions: {},
        })
      ).not.toThrow('Store is not supported!');
    });
    it('should not throw request with proofFormat and proofOptions with domain and challenge', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
          proofFormat: 'jwt',
          proofOptions: { domain: 'test', challenge: 'test' },
        })
      ).not.toThrow('Store is not supported!');
    });
    it('should throw domain is not a string', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
          proofFormat: 'jwt',
          proofOptions: { domain: 123, challenge: 'test' },
        })
      ).toThrow('Domain is not a string');
    });
    it('should throw challenge is not a string', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
          proofFormat: 'jwt',
          proofOptions: { challenge: 123, domain: 'test' },
        })
      ).toThrow('Challenge is not a string');
    });
    it('should throw type is not a string', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [{ id: 'test-id', metadata: { store: 'snap' } }],
          proofFormat: 'jwt',
          proofOptions: { type: 123, challenge: 'test', domain: 'test' },
        })
      ).toThrow('Type is not a string');
    });
    it('should not throw complete request', () => {
      expect(() =>
        isValidCreateVPRequest({
          vcs: [
            { id: 'test-id', metadata: { store: 'snap' } },
            { id: 'test-id', metadata: { store: 'ceramic' } },
            { id: 'test-id' },
            { id: 'test-id', metadata: {} },
          ],
          proofFormat: 'lds',
          proofOptions: { type: 'Eth', domain: 'test', challenge: 'test' },
        })
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
    it('should fail if didMethod is a number', () => {
      expect(() => isValidDeleteVCRequest({ didMethod: 42 })).toThrow(Error);
    });
    it('should not throw for string id', () => {
      expect(() => isValidDeleteVCRequest({ id: '123' })).not.toThrow(Error);
    });
    it('should not throw for list of string ids', () => {
      expect(() => isValidDeleteVCRequest({ id: ['123', '456'] })).not.toThrow(
        Error
      );
    });
    it('should not throw for list of string ids and store', () => {
      expect(() =>
        isValidDeleteVCRequest({
          id: ['123', '456'],
          options: { store: 'snap' },
        })
      ).not.toThrow(Error);
    });
    it('should not throw for list of string ids and list of stores', () => {
      expect(() =>
        isValidDeleteVCRequest({
          id: ['123', '456'],
          options: { store: ['snap', 'ceramic'] },
        })
      ).not.toThrow(Error);
    });
    it('should  throw for list of string ids and wrong store', () => {
      expect(() =>
        isValidDeleteVCRequest({
          id: ['123', '456'],
          options: { store: 'snapp' },
        })
      ).toThrow('Store is not supported!');
    });
    it('should  throw for list of not string ids', () => {
      expect(() => isValidDeleteVCRequest({ id: ['123', 456] })).toThrow(
        'ID is not a string or array of strings'
      );
    });
    it('should  throw for empty list of ids', () => {
      expect(() => isValidDeleteVCRequest({ id: [] })).toThrow(
        'ID is not a string or array of strings'
      );
    });
  });
});
