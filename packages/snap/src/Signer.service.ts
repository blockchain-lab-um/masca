import { byteDecoder, byteEncoder } from '@0xpolygonid/js-sdk';
import { MediaType } from '@0xpolygonid/js-sdk/dist/types/iden3comm/constants';
import { CURRENT_STATE_VERSION } from '@blockchain-lab-um/masca-types';
import { proving } from '@iden3/js-jwz';
import { bytesToBase64url, encodeBase64url } from '@veramo/utils';
import elliptic from 'elliptic';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { sha256 } from 'ethereum-cryptography/sha256';

import PolygonService from './polygon-id/Polygon.service';
import StorageService from './storage/Storage.service';
import WalletService from './Wallet.service';

const { ec: EC } = elliptic;

interface JWTHeader {
  typ: 'JWT';
  alg?: string;

  [x: string]: any;
}

interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  iat?: number;
  nbf?: number;
  exp?: number;
  rexp?: number;

  [x: string]: any;
}

interface JWTData {
  header: JWTHeader;
  payload: JWTPayload;
}

interface JWTOptions {
  hash: 'sha256' | 'keccak';
}

interface SignJWTParams {
  type: 'JWT';
  did: string;
  kid: string;
  data: JWTData;
  options: JWTOptions;
}

interface SignJWZParams {
  type: 'JWZ';
  data: string;
}

type SignDataParams = {
  type: 'JWT' | 'JWZ';
} & (SignJWTParams | SignJWZParams);

class SignerService {
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

  private static async signJWT(signJWTParams: SignJWTParams): Promise<string> {
    const state = StorageService.get();
    const method =
      state[CURRENT_STATE_VERSION].accountState[
        state[CURRENT_STATE_VERSION].currentAccount
      ].general.account.ssi.selectedMethod;

    const {
      did,
      kid,
      data: { payload, header },
      options,
    } = signJWTParams;

    switch (method) {
      case 'did:key:jwk_jcs-pub':
      case 'did:key':
      case 'did:jwk': {
        const wallet = WalletService.get();

        const curve = method === 'did:key:jwk_jcs-pub' ? 'p256' : 'secp256k1';

        const ctx = new EC(curve);
        const ecPrivateKey = ctx.keyFromPrivate(wallet.privateKey.slice(2));

        const jwtHeader = {
          ...header,
          alg: curve === 'secp256k1' ? 'ES256K' : 'ES256',
          kid,
        };

        const jwtPayload = {
          ...payload,
          exp: payload.exp ?? Math.floor(Date.now() / 1000) + 60 * 10,
          iat: payload.iat ?? Math.floor(Date.now() / 1000),
          nbf: payload.nbf ?? Math.floor(Date.now() / 1000),
          iss: did,
        };

        const signingInput = [
          encodeBase64url(JSON.stringify(jwtHeader)),
          encodeBase64url(JSON.stringify(jwtPayload)),
        ].join('.');

        let hash: Uint8Array;

        if (options.hash === 'sha256') {
          hash = sha256(Buffer.from(signingInput));
        } else {
          hash = keccak256(Buffer.from(signingInput));
        }

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

        const jwz = await packageMgr.pack(
          MediaType.ZKPMessage,
          byteEncoder.encode(signJWZParams.data),
          {
            senderDID: did,
            profileNonce: 0,
            provingMethodAlg:
              proving.provingMethodGroth16AuthV2Instance.methodAlg.toString(),
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
