'use client';

import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Html5Qrcode } from 'html5-qrcode';

import QRCodeScanner from '../QRCodeScanner';

type ScanQRCodeModalProps = {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onScanSuccess: (decodedText: string, _: any) => void;
};

const ScanQRCodeModal = ({
  title,
  open,
  setOpen,
  onScanSuccess,
}: ScanQRCodeModalProps) => {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!open && scanner) {
      scanner.stop().catch((error) => console.error(error));
    }

    if (open && scanner) {
      setScanner(null);
    }
  }, [open]);

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 dark:bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="dark:bg-navy-blue-500 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900 "
                >
                  {title}
                </Dialog.Title>
                <div>
                  <QRCodeScanner
                    onScanSuccess={onScanSuccess}
                    scanner={scanner}
                    setScanner={setScanner}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
export default ScanQRCodeModal;
