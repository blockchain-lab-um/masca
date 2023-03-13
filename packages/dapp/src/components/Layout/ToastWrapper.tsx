import React from 'react';
import Image from 'next/image';
import * as Toast from '@radix-ui/react-toast';
import { shallow } from 'zustand/shallow';

import { BASE_PATH } from '@/utils/constants';
import { useToastStore } from '@/utils/stores';

export const ToastWrapper = ({ children }: { children: JSX.Element }) => {
  const timerRef = React.useRef(0);

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const { open, setOpen, loading, text, title } = useToastStore(
    (state) => ({
      open: state.open,
      setOpen: state.setOpen,
      loading: state.loading,
      text: state.text,
      title: state.title,
    }),
    shallow
  );

  // TODO: Add description and use the text prop

  return (
    <div>
      <Toast.Provider swipeDirection="right">
        {children}

        <Toast.Root
          className="bg-white rounded-md shadow-md p-4 grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="[grid-area:_title] flex">
            {title}
            {loading && (
              <div className="w-6 h-6 rounded-full object-center animate-spin">
                <Image
                  src={`${BASE_PATH}/images/connect-spinner.png`}
                  alt="Masca Logo"
                  width={24}
                  height={24}
                />
              </div>
            )}
          </Toast.Title>
          <Toast.Action className="[grid-area:_action]" asChild altText="Done">
            <button>Close</button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="[--viewport-padding:_25px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
      </Toast.Provider>
    </div>
  );
};
