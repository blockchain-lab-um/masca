import { create } from 'zustand';

interface ToastStore {
  open: boolean;
  loading: boolean;
  text: string;
  title: string;

  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setText: (text: string) => void;
  setTitle: (title: string) => void;
}

export const useToastStore = create<ToastStore>()((set) => ({
  title: '',
  loading: false,
  open: false,
  text: '',

  setOpen: (open) => set({ open }),
  setLoading: (loading) => set({ loading }),
  setText: (text) => set({ text }),
  setTitle: (title) => set({ title }),
}));
