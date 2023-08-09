import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, setOpen, children }: ModalProps) => (
  <Transition appear show={isOpen} as={Fragment}>
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

      <div className="fixed inset-0 overflow-y-auto overflow-x-hidden">
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
            <Dialog.Panel className="dark:bg-navy-blue-500 max-w-full rounded-2xl bg-white p-6 shadow-xl transition-all">
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default Modal;
