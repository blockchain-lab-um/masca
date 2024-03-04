import {
  chainIdNetworkParamsMapping,
  didMethodChainIdMapping,
  MethodsRequiringNetwork,
} from '@blockchain-lab-um/masca-types';
import { divider, heading, panel, text } from '@metamask/snaps-sdk';
import { createPublicClient, custom, PublicClient } from 'viem';
import { mainnet } from 'viem/chains';

import UIService from './UI.service';

class EthereumService {
  private static instance: PublicClient;

  static async init(): Promise<void> {
    this.instance = await this.createClient();
  }

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
   * Function that returns the ENS of the passed account, if found.
   * @param params.address - Address to check for.
   * @returns string - ENS name.
   */
  static async getEnsName(params: { address: `0x${string}` }): Promise<string> {
    const { address } = params;
    if (!this.instance) {
      throw new Error('Viem client not instanciated.');
    }
    const ensName = await this.instance.getEnsName({
      address,
    });
    if (!ensName) throw new Error('ENS name not found.');
    return ensName;
  }

  /**
   * Function that changes the current network if needed for the selected DID method.
   * @param params.didMethod - DID method to check for.
   * @returns void
   */
  static async requestNetworkSwitch(params: {
    didMethod: MethodsRequiringNetwork;
  }): Promise<void> {
    // FIXME: this method should be revisited, wallet_switchEthereumChain does not exist in ethereum object?
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
    if (!(await UIService.snapConfirm({ content, method: 'other' }))) {
      throw new Error('User rejected network switch.');
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
      // FIXME: examine the method below
      throw new Error('Unsupported network.');
      await this.requestNetworkSwitch({ didMethod });
    }
  }

  /**
   * Function to create a new viem client
   * @returns PublicClient - viem client.
   */
  static async createClient(): Promise<PublicClient> {
    return createPublicClient({
      chain: mainnet,
      transport: custom(ethereum),
    });
  }
}

export default EthereumService;
