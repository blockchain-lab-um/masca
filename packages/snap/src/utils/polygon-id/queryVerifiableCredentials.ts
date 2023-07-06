import { Blockchain, DidMethod, NetworkId } from '@iden3/js-iden3-core';

import { ExtensionService } from './Extension.service';

type QueryVerifiableCredentialsParams = {
  account: string;
};

const METHODS = [DidMethod.PolygonId, DidMethod.Iden3] as const;
const BLOCKCHAINS = [Blockchain.Polygon, Blockchain.Ethereum] as const;
const NETWORKS = [NetworkId.Mumbai, NetworkId.Main, NetworkId.Goerli] as const;

export const queryVerifiableCredentials = async ({
  account,
}: QueryVerifiableCredentialsParams) => {
  const credentials = [];

  for (const method of METHODS) {
    for (const blockchain of BLOCKCHAINS) {
      for (const networkId of NETWORKS) {
        if (
          !(
            blockchain === Blockchain.Ethereum && networkId === NetworkId.Mumbai
          ) &&
          !(blockchain === Blockchain.Polygon && networkId === NetworkId.Goerli)
        ) {
          await ExtensionService.init(account, method, blockchain, networkId);
          const { credWallet } = ExtensionService.getExtensionServiceInstance();
          const creds = await credWallet.list();
          credentials.push(...creds);
        }
      }
    }
  }

  console.log(credentials);
  return credentials;
};
