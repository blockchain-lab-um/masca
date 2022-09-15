import { expect } from 'chai';
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
      expect(() => isValidSaveVCRequest(null)).to.throw(
        Error,
        'Invalid SaveVC request'
      );
    });

    it('should fail for empty object', function () {
      expect(() => isValidSaveVCRequest({})).to.throw(
        Error,
        'Invalid SaveVC request'
      );
    });

    it('should fail for string', function () {
      expect(() => isValidSaveVCRequest('infuraToken')).to.throw(
        Error,
        'Invalid SaveVC request'
      );
    });

    it('should fail for number', function () {
      expect(() => isValidSaveVCRequest(42)).to.throw(
        Error,
        'Invalid SaveVC request'
      );
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
      ).to.not.throw();
    });

    it('should fail for null', function () {
      expect(() => isValidChangeInfuraTokenRequest(null)).to.throw(
        Error,
        'Invalid ChangeInfuraToken request'
      );
    });

    it('should fail for empty object', function () {
      expect(() => isValidChangeInfuraTokenRequest({})).to.throw(
        Error,
        'Invalid ChangeInfuraToken request'
      );
    });

    it('should fail for string', function () {
      expect(() => isValidChangeInfuraTokenRequest('infuraToken')).to.throw(
        Error,
        'Invalid ChangeInfuraToken request'
      );
    });

    it('should fail for number', function () {
      expect(() => isValidChangeInfuraTokenRequest(42)).to.throw(
        Error,
        'Invalid ChangeInfuraToken request'
      );
    });

    it('should fail if infuraToken is null', function () {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: null })
      ).to.throw(Error, 'Invalid ChangeInfuraToken request');
    });

    it('should fail if infuraToken is a number', function () {
      expect(() =>
        isValidChangeInfuraTokenRequest({ infuraToken: 42 })
      ).to.throw(Error, 'Invalid ChangeInfuraToken request');
    });
  });

  /*
    isValidGetVPRequest
  */
  describe('isValidGetVPRequest', function () {
    it('should succeed if vcId is a string', function () {
      expect(() => isValidGetVPRequest({ vcId: 'Valid UUID' })).to.not.throw();
    });

    it('should succeed if all params are strings', function () {
      expect(() =>
        isValidGetVPRequest({
          vcId: 'Valid UUID',
          domain: 'Valid domain',
          challenge: 'Valid challenge',
        })
      ).to.not.throw();
    });

    it('should fail for null', function () {
      expect(() => isValidGetVPRequest(null)).to.throw(
        Error,
        'Invalid GetVP request'
      );
    });

    it('should fail for empty object', function () {
      expect(() => isValidGetVPRequest({})).to.throw(
        Error,
        'Invalid GetVP request'
      );
    });

    it('should fail for string', function () {
      expect(() => isValidGetVPRequest('infuraToken')).to.throw(
        Error,
        'Invalid GetVP request'
      );
    });

    it('should fail for number', function () {
      expect(() => isValidGetVPRequest(42)).to.throw(
        Error,
        'Invalid GetVP request'
      );
    });

    it('should fail if vcId is null', function () {
      expect(() => isValidGetVPRequest({ vcId: null })).to.throw(
        Error,
        'Invalid GetVP request'
      );
    });

    it('should fail if vcId is a number', function () {
      expect(() => isValidGetVPRequest({ vcId: 42 })).to.throw(
        Error,
        'Invalid GetVP request'
      );
    });
  });

  /*
    isValidSwitchMethodRequest
  */
  describe('isValidSwitchMethodRequest', function () {
    it('should succeed if didMethod is a string', function () {
      expect(() =>
        isValidSwitchMethodRequest({ didMethod: 'Valid didMethod' })
      ).to.not.throw();
    });

    it('should fail for null', function () {
      expect(() => isValidSwitchMethodRequest(null)).to.throw(
        Error,
        'Invalid switchMethod request'
      );
    });

    it('should fail for empty object', function () {
      expect(() => isValidSwitchMethodRequest({})).to.throw(
        Error,
        'Invalid switchMethod request'
      );
    });

    it('should fail for string', function () {
      expect(() => isValidSwitchMethodRequest('infuraToken')).to.throw(
        Error,
        'Invalid switchMethod request'
      );
    });

    it('should fail for number', function () {
      expect(() => isValidSwitchMethodRequest(42)).to.throw(
        Error,
        'Invalid switchMethod request'
      );
    });

    it('should fail if didMethod is null', function () {
      expect(() => isValidSwitchMethodRequest({ didMethod: null })).to.throw(
        Error,
        'Invalid switchMethod request'
      );
    });

    it('should fail if didMethod is a number', function () {
      expect(() => isValidSwitchMethodRequest({ didMethod: 42 })).to.throw(
        Error,
        'Invalid switchMethod request'
      );
    });
  });
});
