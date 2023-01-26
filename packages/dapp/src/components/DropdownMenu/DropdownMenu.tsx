import { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { DropdownButton } from './DropdownButton';

const methods = [
  'did:ethr',
  'did:web',
  'did:elem',
  'did:ion',
  'did:web',
  'did:cheqd',
];

export default function DropdownMenu() {
  const [didMethod, setDidMethod] = useState('did:ethr');

  const handleMethodChange = (method: string) => {
    setDidMethod(method);
  };

  return (
    <Menu as="div" className="relative inline-block mx-2">
      {({ open }) => (
        <Fragment>
          <div>
            <Menu.Button
              className={`inline-flex w-full  justify-center text-orange px-4 py-2 text-h4 rounded-3xl font-medium hover:bg-orange/30 focus:outline-none animated-transition ${
                open ? 'bg-orange/30' : ''
              }`}
            >
              {didMethod}
              {open ? (
                <>
                  <ChevronUpIcon
                    className="hidden -mr-1 ml-2 h-5 w-5 md:block"
                    aria-hidden="true"
                  />
                  <ChevronDownIcon
                    className="-mr-1 ml-2 h-5 w-5 md:hidden"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <>
                  <ChevronDownIcon
                    className="hidden -mr-1 ml-2 h-5 w-5 md:block"
                    aria-hidden="true"
                  />
                  <ChevronUpIcon
                    className="-mr-1 ml-2 h-5 w-5 md:hidden"
                    aria-hidden="true"
                  />
                </>
              )}
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
            <Menu.Items className="max-md:-top-12 max-md:transform max-md:-translate-y-full absolute mt-1 right-0 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-2">
                {methods.map((method, id) => {
                  return (
                    <DropdownButton handleBtn={handleMethodChange} key={id}>
                      {' '}
                      {method}{' '}
                    </DropdownButton>
                  );
                })}
              </div>
            </Menu.Items>
          </Transition>
        </Fragment>
      )}
    </Menu>
  );
}
