import { Fragment, useState } from 'react';
import { AvailableVCStores } from '@blockchain-lab-um/masca-types';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';

import Button from '@/components/Button';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import InfoIcon from '@/components/InfoIcon';
import { useMascaStore } from '@/stores';

interface ImportModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  importVC: (vc: string, stores: AvailableVCStores[]) => Promise<boolean>;
}

function ImportModal({ open, setOpen, importVC }: ImportModalProps) {
  const [loading, setLoading] = useState(false);
  const [vc, setVC] = useState('');
  const VCStores = useMascaStore((state) => state.availableVCStores);
  const availableStores = Object.keys(VCStores).filter(
    (key) => VCStores[key] === true
  );
  const [selectedItems, setSelectedItems] = useState<AvailableVCStores[]>([
    availableStores[0] as AvailableVCStores,
  ]);
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
          <div className="fixed inset-0 bg-black bg-opacity-25 dark:bg-opacity-60" />
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
              <Dialog.Panel
                className={clsx(
                  'animated-transition dark:bg-navy-blue-500 w-full max-w-xl overflow-hidden rounded-2xl bg-orange-50 px-8 pb-6 pt-10',
                  'text-left align-middle shadow-xl md:max-w-2xl lg:max-w-2xl'
                )}
              >
                <Dialog.Title
                  as="h3"
                  className="text-h3 font-ubuntu dark:text-navy-blue-50 font-medium leading-6 text-gray-900"
                >
                  Import Credential
                </Dialog.Title>
                <div className="mt-5">
                  <p className="text-md dark:text-navy-blue-200 text-gray-600">
                    Add a custom credential to your wallet. Paste JSON of the
                    credential in the textarea bellow.
                  </p>
                </div>
                <div className="mt-5">
                  <div className="dark:bg-navy-blue-300 dark:border-navy-blue-400 group relative z-0 rounded-2xl border border-gray-200 bg-gray-50 pr-2 pt-1">
                    <textarea
                      className={clsx(
                        'group-hover:scrollbar-thumb-orange-300 dark:text-navy-blue-700 dark:bg-navy-blue-300',
                        'scrollbar-thin scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full font-jetbrains-mono',
                        'min-h-[60vh] w-full resize-none rounded-2xl bg-gray-50 p-2 text-gray-700 focus:outline-none'
                      )}
                      value={vc}
                      onChange={(e) => setVC(e.target.value)}
                    />
                  </div>
                  <div className="text-h5 font-ubuntu dark:text-navy-blue-50 mt-8 font-medium text-gray-900">
                    SETTINGS
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-x-8">
                    <span className="text-md dark:text-navy-blue-200 flex gap-x-1 text-gray-600">
                      Storage <InfoIcon>Select one or more locations.</InfoIcon>
                    </span>
                    <div className="flex flex-1">
                      <DropdownMultiselect
                        items={availableStores}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        placeholder="Select storage..."
                        name="storage"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-end">
                  <div className="mt-4">
                    <Button
                      onClick={() => setOpen(false)}
                      variant="gray"
                      shadow="md"
                      size="xs"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="ml-2 mt-4">
                    <Button
                      onClick={async () => {
                        setLoading(true);
                        const res = await importVC(vc, selectedItems);
                        if (res) {
                          setOpen(false);
                        }
                        setLoading(false);
                      }}
                      variant="primary"
                      size="sm"
                      shadow="md"
                      loading={loading}
                    >
                      Import VC
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ImportModal;
