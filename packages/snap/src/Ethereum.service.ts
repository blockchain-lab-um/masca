import {
  chainIdNetworkParamsMapping,
  didMethodChainIdMapping,
  MethodsRequiringNetwork,
} from '@blockchain-lab-um/masca-types';
import { divider, heading, panel, text } from '@metamask/snaps-sdk';

import UIService from './UI.service';

class EthereumService {
  /**
   * Function that returns the current network.
   *
   * @returns string - current network.
   */
  static async getNetwork(): Promise<string> {
    const network = (await ethereum.request({
      method: 'eth_chainId',
    })) as string;

    return network;
  }

  /**
   * Function that changes the current network if needed for the selected DID method.
   * @param params.didMethod - DID method to check for.
   * @returns void
   */
  static async requestNetworkSwitch(params: {
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
    if (!(await UIService.snapConfirm({ content }))) {
      throw new Error('User rejected network switch.');
    }
    const chainId = didMethodChainIdMapping[didMethod][0];
    // FIXME: method below fails. "it doesnt exist..."
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

  /**
   * Function that checks if the current network is valid for the selected DID method.
   * @param params.didMethod - DID method to check for.
   * @returns void
   */
  static async handleNetwork(params: {
    didMethod: MethodsRequiringNetwork;
  }): Promise<void> {
    const { didMethod } = params;
    const chainId = await this.getNetwork();

    if (
      !didMethodChainIdMapping[didMethod].includes(chainId) &&
      !didMethodChainIdMapping[didMethod].includes('*')
    ) {
      await this.requestNetworkSwitch({ didMethod });
    }
  }
}

export default EthereumService;
