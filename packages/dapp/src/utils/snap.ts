/* eslint-disable react-hooks/rules-of-hooks */
import { enableSSISnap } from '@blockchain-lab-um/ssi-snap-connector';

import { useSnapStore } from '@/utils/stores';

// const snapId = 'local:http://localhost:8081';
const snapId = 'npm:@blockchain-lab-um/ssi-snap';

export const connectWallet = async () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const changeSnapApi = useSnapStore((state) => state.changeSnapApi);

  const snap = await enableSSISnap({ snapId });
  changeSnapApi(await snap.getSSISnapApi());
};
