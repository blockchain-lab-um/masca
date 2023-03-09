import { Fragment, useState } from 'react';
import { AvailableVCStores } from '@blockchain-lab-um/ssi-snap-types';
import { Dialog, Transition } from '@headlessui/react';

import Button from '@/components/Button';
import DropdownMultiselect from '@/components/DropdownMultiselect';
import InfoIcon from '@/components/InfoIcon';
import { useSnapStore } from '@/utils/stores';

interface ImportModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  importVC: (vc: string, stores: AvailableVCStores[]) => Promise<boolean>;
}

function ImportModal({ open, setOpen, importVC }: ImportModalProps) {
  const [loading, setLoading] = useState(false);
  const [vc, setVC] = useState('');
  const VCStores = useSnapStore((state) => state.availableVCStores);
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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="w-full max-w-md md:max-w-xl lg:max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-orange-500"
                >
                  Import Credential
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Add a custom credential to your wallet. Paste JSON of the
                    credential in the textarea bellow.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="relative z-0 group bg-orange-100 pt-1 pr-2 rounded-2xl shadow-md">
                    <textarea
                      className="group-hover:scrollbar-thumb-orange-300 scrollbar-thin rounded-2xl scrollbar-thumb-orange-300/0 scrollbar-thumb-rounded-full bg-orange-100 min-h-[60vh] w-full resize-none focus:outline-none p-2 text-orange-900 font-jetbrains-mono "
                      value={vc}
                      onChange={(e) => setVC(e.target.value)}
                    />
                  </div>
                  <div className="text-orange-500 font-semibold mt-8 pl-2 text-sm">
                    SETTINGS
                  </div>
                  <div className="px-4  flex justify-between items-center">
                    <span className="text-gray-700 text-sm flex gap-x-1">
                      Storage <InfoIcon>Select one or more locations.</InfoIcon>
                    </span>
                    <div>
                      <DropdownMultiselect
                        items={availableStores}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        placeholder="Select storage ssssda "
                        name="storage"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end items-center">
                  <div className="mt-4">
                    <Button
                      onClick={() => setOpen(false)}
                      variant="gray"
                      size="popup"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="mt-4 ml-2">
                    <Button
                      onClick={async () => {
                        setLoading(true);
                        const res = await importVC(vc, selectedItems);
                        if (res) {
                          setOpen(false);
                          setLoading(false);
                        }
                      }}
                      variant="primary"
                      size="popup"
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
