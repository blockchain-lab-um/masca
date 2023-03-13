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
          className="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white p-4 shadow-md [grid-template-areas:_'title_action'_'description_action'] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="flex [grid-area:_title]">
            {title}
            {loading && (
              <div className="h-6 w-6 animate-spin rounded-full object-center">
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
        <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
      </Toast.Provider>
    </div>
  );
};
