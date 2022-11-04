import {
  getBIP44AddressKeyDeriver,
  BIP44CoinTypeNode,
} from '@metamask/key-tree';
import { SnapProvider } from '@metamask/snap-types';

// export async function getAddressKey(wallet: SnapProvider, addressIndex = 0) {
//   // By way of example, we will use Dogecoin, which has `coin_type` 3.
//   const etherNode = (await wallet.request({
//     method: 'snap_getBip44Entropy',
//     params: {
//       coinType: 60,
//     },
//   })) as BIP44CoinTypeNode;

//   const deriveEthereumAdress = await getBIP44AddressKeyDeriver(etherNode);

//   const derivedAddress = await deriveEthereumAdress(addressIndex);
//   const privateKey = derivedAddress.privateKey;
//   const chainCode = derivedAddress.chainCode;
//   const addressKey = `0x${privateKey as string}${chainCode}`;

//   return {
//     originalAddressKey: addressKey,
//     privateKey: privateKey,
//     derivationPath: deriveEthereumAdress.path,
//   };
// }

export async function getAddressKeyDeriver(wallet: SnapProvider) {
  const bip44Node = (await wallet.request({
    method: 'snap_getBip44Entropy',
    params: {
      coinType: 60,
    },
  })) as BIP44CoinTypeNode;

  return bip44Node;
}

export async function getAddressKey(
  bip44Node: BIP44CoinTypeNode,
  addressIndex = 0
) {
  const keyDeriver = await getBIP44AddressKeyDeriver(bip44Node);
  const privateKey = (await keyDeriver(addressIndex)).privateKey;
  const chainCode = (await keyDeriver(addressIndex)).chainCode;
  const addressKey = `0x${privateKey as string}${chainCode}`;
  return {
    privateKey: privateKey,
    originalAddressKey: addressKey,
    derivationPath: keyDeriver.path,
  };
}
