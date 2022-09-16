import {
  isValidChangeInfuraTokenRequest,
  isValidGetVCsRequest,
  isValidGetVPRequest,
  isValidSaveVCRequest,
  isValidSwitchMethodRequest,
} from '../../src/utils/params';

describe('Utils [params]', () => {
  /*
    isValidGetVCsRequest
  */
  describe('isValidGetVCsRequest', () => {
    // -
  });

  /*
    isValidSaveVCRequest
  */
  describe('isValidSaveVCRequest', () => {
    // TODO: Should we maybe also test and check for valid VPs ?
    it('should fail for null', () => {
      expect(() => isValidSaveVCRequest(null)).toThrowError(Error);
    });

    it('should fail for empty object', () => {
      expect(() => isValidSaveVCRequest({})).toThrowError(Error);
    });

    it('should fail for string', () => {
      expect(() => isValidSaveVCRequest('infuraToken')).toThrowError(Error);
    });

    it('should fail for number', () => {
      expect(() => isValidSaveVCRequest(42)).toThrowError(Error);
      console.log('sometinaskldnaslk');
    });
  });

  /*
    isValidChangeInfuraTokenRequest
  */
  describe('isValidChangeInfuraTokenRequest', () => {
    it('should succeed if infuraToken is a string', () => {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: 'Valid infura token' })
      ).not.toThrowError();
    });

    it('should fail for null', () => {
      expect(() => isValidChangeInfuraTokenRequest(null)).toThrowError(Error);
    });

    it('should fail for empty object', () => {
      expect(() => isValidChangeInfuraTokenRequest({})).toThrowError(Error);
    });

    it('should fail for string', () => {
      expect(() => isValidChangeInfuraTokenRequest('infuraToken')).toThrowError(
        Error
      );
    });

    it('should fail for number', () => {
      expect(() => isValidChangeInfuraTokenRequest(42)).toThrowError(Error);
    });

    it('should fail if infuraToken is null', () => {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: null })
      ).toThrowError(Error);
    });

    it('should fail if infuraToken is a number', () => {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: 42 })
      ).toThrowError(Error);
    });
  });

  /*
    isValidGetVPRequest
  */
  describe('isValidGetVPRequest', () => {
    it('should succeed if vcId is a string', () => {
      expect(() =>
        isValidGetVPRequest({ vcId: 'Valid UUID' })
      ).not.toThrowError();
    });

    it('should succeed if all params are strings', () => {
      expect(() =>
        isValidGetVPRequest({
          vcId: 'Valid UUID',
          domain: 'Valid domain',
          challenge: 'Valid challenge',
        })
      ).not.toThrowError();
    });

    it('should fail for null', () => {
      expect(() => isValidGetVPRequest(null)).toThrowError(Error);
    });

    it('should fail for empty object', () => {
      expect(() => isValidGetVPRequest({})).toThrowError(Error);
    });

    it('should fail for string', () => {
      expect(() => isValidGetVPRequest('infuraToken')).toThrowError(Error);
    });

    it('should fail for number', () => {
      expect(() => isValidGetVPRequest(42)).toThrowError(Error);
    });

    it('should fail if vcId is null', () => {
      expect(() => isValidGetVPRequest({ vcId: null })).toThrowError(Error);
    });

    it('should fail if vcId is a number', () => {
      expect(() => isValidGetVPRequest({ vcId: 42 })).toThrowError(Error);
    });
  });

  /*
    isValidSwitchMethodRequest
  */
  describe('isValidSwitchMethodRequest', () => {
    it('should succeed if didMethod is a string', () => {
      expect(() =>
        isValidSwitchMethodRequest({ didMethod: 'Valid didMethod' })
      ).not.toThrowError();
    });

    it('should fail for null', () => {
      expect(() => isValidSwitchMethodRequest(null)).toThrowError(Error);
    });

    it('should fail for empty object', () => {
      expect(() => isValidSwitchMethodRequest({})).toThrowError(Error);
    });

    it('should fail for string', () => {
      expect(() => isValidSwitchMethodRequest('infuraToken')).toThrowError(
        Error
      );
    });

    it('should fail for number', () => {
      expect(() => isValidSwitchMethodRequest(42)).toThrowError(Error);
    });

    it('should fail if didMethod is null', () => {
      expect(() =>
        isValidSwitchMethodRequest({ didMethod: null })
      ).toThrowError(Error);
    });

    it('should fail if didMethod is a number', () => {
      expect(() => isValidSwitchMethodRequest({ didMethod: 42 })).toThrowError(
        Error
      );
    });
  });
});
