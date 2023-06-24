'use client';

import { useState } from 'react';

import Button from '../Button';
import ScanQRCodesModal from './ScanQRCodeModal';

const ScanConnectionCard = () => {
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);

  const onScanSuccessConnectionQRCode = (decodedText: string, _: any) => {
    console.log(decodedText);

    // TODO: Decode session data
    // Save session data globally

    setIsConnectionModalOpen(false);
  };

  const onScanSuccessQRCode = (decodedText: string, _: any) => {
    console.log(decodedText);

    setIsQRCodeModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-1 flex-col space-y-4 p-4">
        <div className="flex-1 space-y-2">
          <p>
            Use this on your mobile device to first scan the connection QR code
            to astablish a connection with your browser. After that you can scan
            any other QR code that you want to pass to your browser to be
            handled by the Masca Dapp.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            variant="primary"
            onClick={() => setIsConnectionModalOpen(true)}
          >
            Scan Connection
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsQRCodeModalOpen(true)}
          >
            Scan QR Code
          </Button>
        </div>
      </div>
      <ScanQRCodesModal
        onScanSuccess={onScanSuccessConnectionQRCode}
        title="Scan Connection QR Code"
        open={isConnectionModalOpen}
        setOpen={setIsConnectionModalOpen}
      />
      <ScanQRCodesModal
        onScanSuccess={onScanSuccessQRCode}
        title="Scan QR Code"
        open={isQRCodeModalOpen}
        setOpen={setIsQRCodeModalOpen}
      />
    </>
  );
};

export default ScanConnectionCard;
