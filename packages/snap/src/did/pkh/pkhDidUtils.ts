import { MetaMaskInpageProvider } from '@metamask/providers';
import { getCurrentNetwork } from '../../utils/snapUtils';

export async function getDidPkhIdentifier(
  ethereum: MetaMaskInpageProvider,
  account: string
): Promise<string> {
  const network = await getCurrentNetwork(ethereum);
  if (network === '0x137') {
    return 'eip155:137:' + account;
  } else return 'eip155:1:' + account;
}
