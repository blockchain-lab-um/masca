import {
  MethodsRequiringNetwork,
  didMethodChainIdMapping,
} from '@blockchain-lab-um/masca-types';
import { PublicClient, createPublicClient, custom } from 'viem';
import { mainnet } from 'viem/chains';

class EthereumService {
  private static instance: PublicClient;

  static async init(): Promise<void> {
    EthereumService.instance = await EthereumService.createClient();
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
    if (!EthereumService.instance) {
      throw new Error('Viem client not instanciated.');
    }
    const ensName = await EthereumService.instance.getEnsName({
      address,
    });
    if (!ensName) throw new Error('ENS name not found.');
    return ensName;
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
    const chainId = await EthereumService.getNetwork();

    if (
      !didMethodChainIdMapping[didMethod].includes(chainId) &&
      !didMethodChainIdMapping[didMethod].includes('*')
    ) {
      throw new Error('Unsupported network.');
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
