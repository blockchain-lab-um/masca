import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
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

  useEffect(() => {
    console.log('🚀 ~ useEffect ~ isConnected: ', isConnected);
    console.log('🚀 ~ useEffect ~ isConnecting: ', isConnecting);
    console.log('🚀 ~ useEffect ~ status: ', status);
  }, [isConnected, isConnecting, status]);

  return (
    !isConnected &&
    metamaskConnector && (
      <Button
        key={metamaskConnector.uid}
        variant="connect"
        size="md"
        onClick={() => {
          connect(
            { connector: metamaskConnector },
            {
              onSuccess: () => {
                console.log('success');
              },
            }
          );
        }}
        loading={isConnecting}
      >
        {t('connect')}
      </Button>
    )
  );
};

export default ConnectButton;
