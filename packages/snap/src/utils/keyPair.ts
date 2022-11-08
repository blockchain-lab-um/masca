import {
  getBIP44AddressKeyDeriver,
  BIP44CoinTypeNode,
} from '@metamask/key-tree';
import { SnapProvider } from '@metamask/snap-types';
import { SSISnapState } from 'src/interfaces';
import { getAccountIndex, setAccountIndex } from './snapUtils';
import { ethers } from 'ethers';
import { _hexToUnit8Array } from './snapUtils';

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
  console.log('before');
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

export const getKeysFromAddress = async (
  bip44Node: BIP44CoinTypeNode,
  state: SSISnapState,
  account: string,
  wallet: SnapProvider,
  maxScan = 20
) => {
  let addressIndex;
  const index = getAccountIndex(state, account);
  if (index) {
    addressIndex = index;
    console.log(
      `getNextAddressIndex:\nFound address in state: ${addressIndex} ${account}`
    );
  } else {
    for (let i = 0; i < maxScan; i++) {
      const { address } = await getKeysFromAddressIndex(bip44Node, i);
      // get address from public key
      if (address.toUpperCase() === account.toUpperCase()) {
        addressIndex = i;
        await setAccountIndex(wallet, state, account, addressIndex);
        console.log(
          `getNextAddressIndex:\nFound address in scan: ${addressIndex} ${account}`
        );
        break;
      }
    }
  }

  if (!isNaN(addressIndex as number)) {
    return getKeysFromAddressIndex(bip44Node, addressIndex);
  }
  return null;
};

export const getKeysFromAddressIndex = async (
  bip44Node: BIP44CoinTypeNode,
  index: number | undefined
) => {
  if (typeof index === 'undefined') {
    throw new Error('Err, index undefined');
  }
  const addressIndex = index;
  if (isNaN(addressIndex) || addressIndex < 0) {
    console.log(`getKeysFromAddressIndex: addressIndex found: ${addressIndex}`);
  }

  const { privateKey, derivationPath } = await getAddressKey(
    bip44Node,
    addressIndex
  );
  const wallet = new ethers.Wallet(_hexToUnit8Array(privateKey));

  return {
    privateKey: privateKey,
    publicKey: wallet.publicKey,
    address: wallet.address,
    addressIndex,
    derivationPath,
  };
};
