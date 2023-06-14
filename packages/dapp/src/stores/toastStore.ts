import { create } from 'zustand';

interface ToastStore {
  open: boolean;
  loading: boolean;
  text: string;
  title: string;
  type: string;

  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setText: (text: string) => void;
  setTitle: (title: string) => void;
  setType: (type: string) => void;
}

export const toastStoreInitialState = {
  open: false,
  loading: false,
  text: '',
  title: '',
  type: 'info',
};

export const useToastStore = create<ToastStore>()((set) => ({
  ...toastStoreInitialState,

  setType: (type) => set({ type }),
  setOpen: (open) => set({ open }),
  setLoading: (loading) => set({ loading }),
  setText: (text) => set({ text }),
  setTitle: (title) => set({ title }),
}));
