import { create } from 'zustand';

type ToastType = 'info' | 'success' | 'error' | 'normal';

interface ToastStore {
  open: boolean;
  loading: boolean;
  text: string;
  title: string;
  type: ToastType;
}

export const toastStoreInitialState = {
  open: false,
  loading: false,
  text: '',
  title: '',
  type: 'info' as ToastType,
};

export const useToastStore = create<ToastStore>()(() => ({
  ...toastStoreInitialState,
}));
