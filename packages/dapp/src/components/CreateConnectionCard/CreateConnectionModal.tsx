'use client';

import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { QRCodeSVG } from 'qrcode.react';
import { shallow } from 'zustand/shallow';

import { useSessionStore } from '@/stores';

type CreateConnectionModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CreateConnectionModal = ({
  open,
  setOpen,
}: CreateConnectionModalProps) => {
  const { changeSessionId, changeKey, changeExp } = useSessionStore(
    (state) => ({
      changeSessionId: state.changeSessionId,
      changeKey: state.changeKey,
      changeExp: state.changeExp,
    }),
    shallow
  );

  const createSession = async (): Promise<string> => {
    // Create session ID
    const sessionId = crypto.randomUUID();

    const key = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );

    // Export key data
    const keyData = await crypto.subtle.exportKey('jwk', key);

    // Set expiration date (1 hour from now)
    const exp = new Date();
    exp.setHours(exp.getHours() + 1);

    // Set global session data
    changeSessionId(sessionId);
    changeKey(key);
    changeExp(exp);

    // Create session
    return JSON.stringify({
      sessionId,
      keyData,
      exp: exp.toISOString(),
    });
  };

  useEffect(() => {
    if (open) {
      createSession()
        .then((a) => console.log(a.length))
        .catch(console.error);
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
              <Dialog.Panel className="dark:bg-navy-blue-500 w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="font-ubuntu dark:text-navy-blue-50 text-xl font-medium leading-6 text-gray-900 "
                >
                  Connection QR Code
                </Dialog.Title>
                <div className="mt-8 flex w-full justify-center">
                  <div className="dark:border-orange-accent-dark border- rounded-xl border-2 border-pink-500 bg-white p-4">
                    <QRCodeSVG value="https://www.google.com" />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateConnectionModal;
