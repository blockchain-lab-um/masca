import {
  AvailableMethods,
  chainIdNetworkParamsMapping,
  didMethodChainIdMapping,
  type SwitchMethodRequestParams,
} from '@blockchain-lab-um/masca-types';
import { BIP44CoinTypeNode } from '@metamask/key-tree';
import { divider, heading, panel, text } from '@metamask/snaps-ui';

import type { ApiParams } from '../../interfaces';
import { changeCurrentMethod } from '../../utils/didUtils';
import { getCurrentNetwork, snapConfirm } from '../../utils/snapUtils';

async function requestNetworkSwitch(params: {
  didMethod: AvailableMethods;
}): Promise<boolean> {
  const { didMethod } = params;
  const requestNetworkSwitchContent = panel([
    heading('Switch Network'),
    text(
      `${didMethod} is not available for your currently selected network. Would you like to switch your network?`
    ),
    divider(),
    text(
      `Switching to: ${didMethod} on chainId: ${didMethodChainIdMapping[didMethod][0]}}`
    ),
  ]);
  if (!(await snapConfirm(snap, requestNetworkSwitchContent))) {
    throw new Error('User rejected network switch');
  }
  const chainId = didMethodChainIdMapping[didMethod][0];
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    return true;
  } catch (err) {
    if (
      (err as { code?: number; message: string; stack: string }).code === 4902
    ) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainIdNetworkParamsMapping[chainId]],
      });
      return true;
    }
    throw err as Error;
  }
}

export async function switchMethod(
  params: ApiParams,
  { didMethod }: SwitchMethodRequestParams
): Promise<string> {
  const { state, snap, ethereum, account, bip44CoinTypeNode } = params;
  const method = state.accountState[account].accountConfig.ssi.didMethod;
  const chainId = await getCurrentNetwork(ethereum);
  if (
    !didMethodChainIdMapping[didMethod].includes(chainId) &&
    !didMethodChainIdMapping[didMethod].includes('*') &&
    !(await requestNetworkSwitch({ didMethod }))
  ) {
    throw new Error('Invalid network');
  }
  if (didMethod !== method) {
    const switchNetworkContent = panel([
      heading('Switch Method'),
      text('Would you like to switch DID method?'),
      divider(),
      text(`Switching to: ${didMethod}`),
    ]);

    if (await snapConfirm(snap, switchNetworkContent)) {
      const res = await changeCurrentMethod({
        snap,
        ethereum,
        state,
        account,
        didMethod,
        bip44CoinTypeNode: bip44CoinTypeNode as BIP44CoinTypeNode,
      });
      return res;
    }

    throw new Error('User rejected method switch');
  }

  throw new Error('Method already set');
}
