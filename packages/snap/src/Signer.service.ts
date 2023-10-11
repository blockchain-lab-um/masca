import {
  byteDecoder,
  byteEncoder,
  PROTOCOL_CONSTANTS,
} from '@0xpolygonid/js-sdk';
import {
  CURRENT_STATE_VERSION,
  SignJWTParams,
  SignJWZParams,
} from '@blockchain-lab-um/masca-types';
import { DID } from '@iden3/js-iden3-core';
import { proving } from '@iden3/js-jwz';
import { bytesToBase64url, encodeBase64url } from '@veramo/utils';
import elliptic from 'elliptic';
import { sha256 } from 'ethereum-cryptography/sha256';

import PolygonService from './polygon-id/Polygon.service';
import StorageService from './storage/Storage.service';
import UIService from './UI.service';
import WalletService from './Wallet.service';

const { ec: EC } = elliptic;

type SignJWTParamsExtended = SignJWTParams & {
  did: string;
  kid: string;
};

type SignDataParams = {
  type: 'JWT' | 'JWZ';
} & (SignJWTParamsExtended | SignJWZParams);

class SignerService {
  /**
   * Sign data
   * @param signDataParams - Sign data params
   * @returns Promise<string> - Signed data string
   * @throws Error - Unsupported sign data type
   */
  static async signData(signDataParams: SignDataParams): Promise<string> {
    switch (signDataParams.type) {
      case 'JWT':
        return this.signJWT(signDataParams);
      case 'JWZ':
        return this.signJWZ(signDataParams);
      default: {
        throw new Error('Unsupported sign data type.');
      }
    }
  }

  /**
   * Sign JWT
   * @param signJWTParams - Sign JWT params
   * @returns Promise<string> - Signed JWT string
   * @throws Error - Unsupported DID method or user rejected JWT signing
   */
  private static async signJWT(
    signJWTParams: SignJWTParamsExtended
  ): Promise<string> {
    const state = StorageService.get();
    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

    const { did, kid } = signJWTParams;
    const data = signJWTParams.data || { header: {}, payload: {} };
    const header = data.header || {};
    const payload = data.payload || {};

    switch (method) {
      case 'did:key:jwk_jcs-pub':
      case 'did:key':
      case 'did:jwk': {
        const wallet = WalletService.get();

        const curve = method === 'did:key:jwk_jcs-pub' ? 'p256' : 'secp256k1';

        const ctx = new EC(curve);
        const ecPrivateKey = ctx.keyFromPrivate(wallet.privateKey.slice(2));

        const alg = curve === 'secp256k1' ? `ES256K` : `ES256`;

        const jwtHeader = {
          ...header,
          typ: header.typ ?? 'JWT',
          alg,
          kid,
        };

        const jwtPayload = {
          ...payload,
          exp: payload.exp ?? Math.floor(Date.now() / 1000) + 60 * 10,
          iat: payload.iat ?? Math.floor(Date.now() / 1000),
          nbf: payload.nbf ?? Math.floor(Date.now() / 1000),
          iss: did,
        };

        if (
          !(await UIService.signDataJWTDialog({
            header: jwtHeader,
            payload: jwtPayload,
          }))
        ) {
          throw new Error('User rejected JWT signing');
        }

        const signingInput = [
          encodeBase64url(JSON.stringify(jwtHeader)),
          encodeBase64url(JSON.stringify(jwtPayload)),
        ].join('.');

        const hash = sha256(Buffer.from(signingInput));

        const signature = ecPrivateKey.sign(hash);

        const signatureBuffer = Buffer.concat([
          signature.r.toArrayLike(Buffer, 'be', 32),
          signature.s.toArrayLike(Buffer, 'be', 32),
        ]);

        const signatureBase64 = bytesToBase64url(signatureBuffer);

        const signedJwt = [signingInput, signatureBase64].join('.');

        return signedJwt;
      }
      default:
        throw new Error('Unsupported DID method');
    }
  }

  /**
   * Sign JWZ
   * @param signJWZParams - Sign JWZ params
   * @returns Promise<string> - Signed JWZ string
   * @throws Error - Unsupported DID method or user rejected JWZ signing
   */
  private static async signJWZ(signJWZParams: SignJWZParams): Promise<string> {
    const state = StorageService.get();
    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

    switch (method) {
      case 'did:polygonid':
      case 'did:iden3': {
        const did = await PolygonService.getIdentifier();
        const { packageMgr } = PolygonService.get();

        const data = { ...signJWZParams.data, from: did };

        if (
          !(await UIService.signDataJWZDialog({
            data,
          }))
        ) {
          throw new Error('User rejected JWZ signing');
        }

        const jwz = await packageMgr.pack(
          PROTOCOL_CONSTANTS.MediaType.ZKPMessage,
          byteEncoder.encode(JSON.stringify(data)),
          {
            senderDID: DID.parse(did),
            provingMethodAlg:
              proving.provingMethodGroth16AuthV2Instance.methodAlg,
          }
        );

        return byteDecoder.decode(jwz);
      }
      default:
        throw new Error('Unsupported DID method');
    }
  }
}

export default SignerService;
