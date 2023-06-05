'use client';

import React, { useEffect, useRef } from 'react';
import { XCircleIcon } from '@heroicons/react/24/outline';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/solid';
import * as Toast from '@radix-ui/react-toast';
import clsx from 'clsx';
import { shallow } from 'zustand/shallow';

import { useToastStore } from '@/stores';

const ToastWrapper = ({ children }: { children: JSX.Element }) => {
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const { open, setOpen, loading, type, title } = useToastStore(
    (state) => ({
      open: state.open,
      setOpen: state.setOpen,
      loading: state.loading,
      title: state.title,
      type: state.type,
    }),
    shallow
  );

  const toastType: Record<string, string> = {
    normal: 'bg-pink-500',
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  const toastIcon: Record<string, JSX.Element> = {
    normal: (
      <div>
        {loading && (
          <div className="mx-3 flex items-center">
            <div
              className={clsx(
                'h-5 w-5 border-2',
                'ml-1 animate-spin rounded-full border-solid border-t-pink-900/0',
                'border-pink-500'
              )}
            ></div>
          </div>
        )}
      </div>
    ),
    success: <CheckCircleIcon className="mx-3 h-6 w-6 text-green-700" />,
    error: <ExclamationCircleIcon className="mx-3 h-6 w-6 text-red-700" />,
    info: <QuestionMarkCircleIcon className="mx-3 h-6 w-6 text-blue-700" />,
  };

  return (
    <div className="h-full">
      <Toast.Provider swipeDirection="right">
        {children}

        <Toast.Root
          className="data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=end]:animate-swipeOut grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md bg-white shadow-md [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
          open={open}
          onOpenChange={setOpen}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={clsx(toastType[type], 'h-14 w-2 rounded-l-2xl')}
              />

              <Toast.Title className="flex items-center [grid-area:_title]">
                {toastIcon[type]}
                {title}
              </Toast.Title>
            </div>
            <Toast.Action
              className="[grid-area:_action]"
              asChild
              altText="Done"
            >
              <button>
                <XCircleIcon className="h-6 w-6" />
              </button>
            </Toast.Action>
          </div>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
      </Toast.Provider>
    </div>
  );
};

export default ToastWrapper;
