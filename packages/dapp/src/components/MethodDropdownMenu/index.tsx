import { Fragment } from 'react';
import type { AvailableMethods } from '@blockchain-lab-um/masca-types';
import { isError } from '@blockchain-lab-um/utils';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { shallow } from 'zustand/shallow';

import { useMascaStore, useToastStore } from '@/stores';
import { DropdownButton } from './MethodDropdownButton';

export default function MethodDropdownMenu() {
  const { api, currMethod, methods, changeCurrDIDMethod, changeDID } =
    useMascaStore(
      (state) => ({
        api: state.mascaApi,
        currMethod: state.currDIDMethod,
        methods: state.availableMethods,
        changeCurrDIDMethod: state.changeCurrDIDMethod,
        changeDID: state.changeCurrDID,
      }),
      shallow
    );
  const { setTitle, setLoading, setToastOpen, setType } = useToastStore(
    (state) => ({
      setTitle: state.setTitle,
      setText: state.setText,
      setLoading: state.setLoading,
      setToastOpen: state.setOpen,
      setType: state.setType,
    }),
    shallow
  );

  const handleMethodChange = async (method: string) => {
    if (method !== currMethod) {
      if (!api) return;
      const res = await api.switchDIDMethod(method as AvailableMethods);

      // TODO: Show toast with error message
      if (!isError(res)) {
        changeCurrDIDMethod(method);
        changeDID(res.data);
      } else {
        setToastOpen(false);
        setTimeout(() => {
          setTitle('Failed to change method');
          setType('error');
          setLoading(false);
          setToastOpen(true);
        }, 100);
      }
    }
  };

  return (
    <Menu as="div" className="relative z-20 mx-2">
      {({ open }) => (
        <Fragment>
          <div>
            <Menu.Button
              className={`dark:text-navy-blue-400 text-h5 font-ubuntu animated-transition inline-flex w-full justify-center rounded-3xl px-4 py-2 font-thin text-gray-600 focus:outline-none ${
                open
                  ? 'dark:bg-navy-blue-800 bg-orange-100/50'
                  : 'dark:hover:bg-navy-blue-800 hover:bg-orange-100/50'
              }`}
            >
              {currMethod}
              <ChevronDownIcon
                className={`dark:text-navy-blue-400 animated-transition -mr-1 ml-2 h-5 w-5 text-gray-600 max-md:rotate-180 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </Menu.Button>
          </div>

          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="dark:bg-navy-blue-500 absolute right-0 mt-1 w-48 rounded-3xl bg-white shadow-lg max-md:-top-12 max-md:-translate-y-full max-md:transform">
              <div className="p-1 text-center ">
                {methods.map((method, id) => (
                  <DropdownButton
                    key={id}
                    selected={method === currMethod}
                    handleBtn={handleMethodChange}
                  >
                    {method}
                  </DropdownButton>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Fragment>
      )}
    </Menu>
  );
}
