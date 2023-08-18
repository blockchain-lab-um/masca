'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Html5Qrcode } from 'html5-qrcode';

import Modal from '@/components/Modal';
import QRCodeScanner from '@/components/QRCodeScanner';

interface ScanQRCodeModalProps {
  title: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  onScanSuccess: (decodedText: string, _: any) => void;
}

const ScanQRCodeModal = ({
  title,
  isOpen,
  setOpen,
  onScanSuccess,
}: ScanQRCodeModalProps) => {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    console.log('Stopping scanner...');
    console.log(isOpen, scanner?.isScanning);
    console.log(scanner);
    console.log('-----------------');
    if (!isOpen && scanner && scanner.isScanning) {
      console.log('SCANNER STOP');
      scanner.stop().catch((error) => console.error(error));
    }

    if (isOpen && scanner) {
      console.log('SCANNER SET NULL');
      setScanner(null);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} setOpen={setOpen}>
      <Dialog.Title
        as="h3"
        className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900 "
      >
        {title}
      </Dialog.Title>
      <div className="w-[48rem] max-w-full">
        <QRCodeScanner
          onScanSuccess={onScanSuccess}
          scanner={scanner}
          setScanner={setScanner}
          setOpen={setOpen}
        />
      </div>
    </Modal>
  );
};
export default ScanQRCodeModal;
