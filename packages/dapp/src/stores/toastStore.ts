import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

type ToastType = 'info' | 'success' | 'error' | 'normal';

interface ToastStore {
  open: boolean;
  loading: boolean;
  text: string;
  title: string;
  type: ToastType;
  link?: string;
}

export const toastStoreInitialState = {
  open: false,
  loading: false,
  text: '',
  title: '',
  type: 'info' as ToastType,
  link: '',
};

export const useToastStore = createWithEqualityFn<ToastStore>()(
  () => ({
    ...toastStoreInitialState,
  }),
  shallow
);
