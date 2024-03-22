'use client';

import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import type { Html5Qrcode } from 'html5-qrcode';
import { useEffect, useState } from 'react';

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
    if (!isOpen && scanner && scanner.isScanning) {
      scanner.stop().catch((error) => console.error(error));
    }

    if (isOpen && scanner) {
      setScanner(null);
    }
  }, [isOpen]);

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      size="2xl"
      hideCloseButton={true}
      placement="center"
      className="main-bg py-2"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>
              <div className="text-h3 font-ubuntu dark:text-navy-blue-50 w-full text-center font-medium leading-6 text-gray-900">
                {title}
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="w-[48rem] max-w-full">
                <QRCodeScanner
                  onScanSuccess={onScanSuccess}
                  scanner={scanner}
                  setScanner={setScanner}
                  setOpen={setOpen}
                />
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
export default ScanQRCodeModal;
