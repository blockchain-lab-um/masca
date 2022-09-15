import {
  isValidChangeInfuraTokenRequest,
  isValidGetVCsRequest,
  isValidGetVPRequest,
  isValidSaveVCRequest,
  isValidSwitchMethodRequest,
} from '../../src/utils/params';

describe('Utils [params]', function () {
  /*
    isValidGetVCsRequest
  */
  describe('isValidGetVCsRequest', function () {
    // -
  });

  /*
    isValidSaveVCRequest
  */
  describe('isValidSaveVCRequest', function () {
    // TODO: Should we maybe also test and check for valid VPs ?
    it('should fail for null', function () {
      expect(() => isValidSaveVCRequest(null)).toThrowError(Error);
    });

    it('should fail for empty object', function () {
      expect(() => isValidSaveVCRequest({})).toThrowError(Error);
    });

    it('should fail for string', function () {
      expect(() => isValidSaveVCRequest('infuraToken')).toThrowError(Error);
    });

    it('should fail for number', function () {
      expect(() => isValidSaveVCRequest(42)).toThrowError(Error);
      console.log('sometinaskldnaslk');
    });
  });

  /*
    isValidChangeInfuraTokenRequest
  */
  describe('isValidChangeInfuraTokenRequest', function () {
    it('should succeed if infuraToken is a string', function () {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: 'Valid infura token' })
      ).not.toThrowError();
    });

    it('should fail for null', function () {
      expect(() => isValidChangeInfuraTokenRequest(null)).toThrowError(Error);
    });

    it('should fail for empty object', function () {
      expect(() => isValidChangeInfuraTokenRequest({})).toThrowError(Error);
    });

    it('should fail for string', function () {
      expect(() => isValidChangeInfuraTokenRequest('infuraToken')).toThrowError(Error);
    });

    it('should fail for number', function () {
      expect(() => isValidChangeInfuraTokenRequest(42)).toThrowError(Error);
    });

    it('should fail if infuraToken is null', function () {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: null })
      ).toThrowError(Error);
    });

    it('should fail if infuraToken is a number', function () {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: 42 })
      ).toThrowError(Error);
    });
  });

  /*
    isValidGetVPRequest
  */
  describe('isValidGetVPRequest', function () {
    it('should succeed if vcId is a string', function () {
      expect(() => isValidGetVPRequest({ vcId: 'Valid UUID' })).not.toThrowError();
    });

    it('should succeed if all params are strings', function () {
      expect(() =>
        isValidGetVPRequest({
          vcId: 'Valid UUID',
          domain: 'Valid domain',
          challenge: 'Valid challenge',
        })
      ).not.toThrowError();
    });

    it('should fail for null', function () {
      expect(() => isValidGetVPRequest(null)).toThrowError(Error);
    });

    it('should fail for empty object', function () {
      expect(() => isValidGetVPRequest({})).toThrowError(Error);
    });

    it('should fail for string', function () {
      expect(() => isValidGetVPRequest('infuraToken')).toThrowError(Error);
    });

    it('should fail for number', function () {
      expect(() => isValidGetVPRequest(42)).toThrowError(Error);
    });

    it('should fail if vcId is null', function () {
      expect(() => isValidGetVPRequest({ vcId: null })).toThrowError(Error);
    });

    it('should fail if vcId is a number', function () {
      expect(() => isValidGetVPRequest({ vcId: 42 })).toThrowError(Error);
    });
  });

  /*
    isValidSwitchMethodRequest
  */
  describe('isValidSwitchMethodRequest', function () {
    it('should succeed if didMethod is a string', function () {
      expect(() =>
        isValidSwitchMethodRequest({ didMethod: 'Valid didMethod' })
      ).not.toThrowError();
    });

    it('should fail for null', function () {
      expect(() => isValidSwitchMethodRequest(null)).toThrowError(Error);
    });

    it('should fail for empty object', function () {
      expect(() => isValidSwitchMethodRequest({})).toThrowError(Error);
    });

    it('should fail for string', function () {
      expect(() => isValidSwitchMethodRequest('infuraToken')).toThrowError(Error);
    });

    it('should fail for number', function () {
      expect(() => isValidSwitchMethodRequest(42)).toThrowError(Error);
    });

    it('should fail if didMethod is null', function () {
      expect(() => isValidSwitchMethodRequest({ didMethod: null })).toThrowError(Error);
    });

    it('should fail if didMethod is a number', function () {
      expect(() => isValidSwitchMethodRequest({ didMethod: 42 })).toThrowError(Error);
    });
  });
});
