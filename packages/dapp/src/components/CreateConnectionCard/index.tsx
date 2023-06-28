'use client';

import { useState } from 'react';

import Button from '@/components/Button';
import { useGeneralStore } from '@/stores';
import CreateConnectionModal from './CreateConnectionModal';

const CreateConnectionCard = () => {
  const isConnected = useGeneralStore((state) => state.isConnected);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-1 flex-col space-y-4 p-4">
        <div className="flex-1 space-y-2">
          <p>
            You can use this page to create a connection with your mobile device
            and use it as a QR code scanner.
          </p>
          <p>
            The Create Connection button will show a QR code that contains your
            session ID and a secret encryption key. This allows for end to end
            encryption of your data between your mobile device and your browser.
          </p>
          <p>
            To create a connection on your browser you need to be connected to
            MetaMask and Masca, but your mobile device does not need to be.
          </p>
        </div>
        <div className="flex justify-center">
          <Button
            variant={isConnected ? 'primary' : 'gray'}
            onClick={() => setIsModalOpen(true)}
            disabled={!isConnected}
          >
            Create Connection
          </Button>
        </div>
      </div>
      <CreateConnectionModal open={isModalOpen} setOpen={setIsModalOpen} />
    </>
  );
};

export default CreateConnectionCard;
