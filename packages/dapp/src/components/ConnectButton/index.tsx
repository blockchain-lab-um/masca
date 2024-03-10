import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';

import Button from '@/components/Button';

const ConnectButton = () => {
  const { connectors, connect, status, isPending: isConnecting } = useConnect();
  const { isConnected } = useAccount();
  const [metamaskConnector, setMetamaskConnector] = useState<Connector | null>(
    null
  );
  const t = useTranslations('ConnectButton');

  useEffect(() => {
    setMetamaskConnector(
      connectors.find(
        (connector) =>
          connector.id === 'io.metamask' || connector.id === 'io.metamask.flask'
      ) || null
    );
  }, [connectors]);

  return (
    !isConnected &&
    metamaskConnector && (
      <Button
        key={metamaskConnector.uid}
        variant="connect"
        size="md"
        onClick={() => {
          connect({ connector: metamaskConnector });
        }}
        loading={isConnecting}
      >
        {t('connect')}
      </Button>
    )
  );
};

export default ConnectButton;
