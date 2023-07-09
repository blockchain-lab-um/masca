import {
  chainIdNetworkParamsMapping,
  didMethodChainIdMapping,
  type MethodsRequiringNetwork,
} from '@blockchain-lab-um/masca-types';
import { divider, heading, panel, text } from '@metamask/snaps-ui';

import { getCurrentNetwork, snapConfirm } from '../../utils/snapUtils';

async function requestNetworkSwitch(params: {
  didMethod: MethodsRequiringNetwork;
}): Promise<void> {
  const { didMethod } = params;
  const content = panel([
    heading('Switch Network'),
    text(
      `${didMethod} is not available for your currently selected network. Would you like to switch your network?`
    ),
    divider(),
    text(
      `Switching to: ${didMethod} on chainId: ${didMethodChainIdMapping[didMethod][0]}`
    ),
  ]);
  if (!(await snapConfirm(content))) {
    throw new Error('User rejected network switch');
  }
  const chainId = didMethodChainIdMapping[didMethod][0];
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (err) {
    if (
      (err as { code?: number; message: string; stack: string }).code === 4902
    ) {
      await ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [chainIdNetworkParamsMapping[chainId]],
      });
    }
    throw err as Error;
  }
}

export async function handleNetwork(params: {
  didMethod: MethodsRequiringNetwork;
}): Promise<void> {
  const { didMethod } = params;
  const chainId = await getCurrentNetwork(ethereum);
  if (
    !didMethodChainIdMapping[didMethod].includes(chainId) &&
    !didMethodChainIdMapping[didMethod].includes('*')
  ) {
    await requestNetworkSwitch({ didMethod });
  }
}
