import {
  isValidChangeInfuraTokenRequest,
  isValidGetVPRequest,
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
  describe('isValidGetVPRequest', () => {
    it('should succeed if vcId is a string', () => {
      expect(() => isValidGetVPRequest({ vcId: 'Valid UUID' })).not.toThrow();
    });

    it('should succeed if all params are strings', () => {
      expect(() =>
        isValidGetVPRequest({
          vcId: 'Valid UUID',
          domain: 'Valid domain',
          challenge: 'Valid challenge',
        })
      ).not.toThrow();
    });

    it('should fail for null', () => {
      expect(() => isValidGetVPRequest(null)).toThrow(Error);
    });

    it('should fail for empty object', () => {
      expect(() => isValidGetVPRequest({})).toThrow(Error);
    });

    it('should fail for string', () => {
      expect(() => isValidGetVPRequest('infuraToken')).toThrow(Error);
    });

    it('should fail for number', () => {
      expect(() => isValidGetVPRequest(42)).toThrow(Error);
    });

    it('should fail if vcId is null', () => {
      expect(() => isValidGetVPRequest({ vcId: null })).toThrow(Error);
    });

    it('should fail if vcId is a number', () => {
      expect(() => isValidGetVPRequest({ vcId: 42 })).toThrow(Error);
    });
  });

  /*
    isValidSwitchMethodRequest
  */
  describe('isValidSwitchMethodRequest', () => {
    it('should succeed if didMethod is a string', () => {
      expect(() =>
        isValidSwitchMethodRequest({ didMethod: 'Valid didMethod' })
      ).not.toThrow();
    });

    it('should fail for null', () => {
      expect(() => isValidSwitchMethodRequest(null)).toThrow(Error);
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
});
