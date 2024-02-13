import { createPublicClient, custom } from 'viem';
import { mainnet } from 'viem/chains';

export class ViemClient {
  private client;

  constructor(params: { provider: any }) {
    const { provider } = params;
    this.client = createPublicClient({
      chain: mainnet,
      transport: custom(provider),
    });
  }

  async getEns(params: { address: `0x${string}` }) {
    const { address } = params;
    const name = await this.client.getEnsName({ address });
    if (!name) throw new Error('ENS name not found.');
    return name;
  }
}
