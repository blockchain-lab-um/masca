import { create } from 'zustand';

interface ToastStore {
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  text: string;
  setText: (text: string) => void;
  title: string;
  setTitle: (title: string) => void;
}

export const useToastStore = create<ToastStore>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  text: '',
  setText: (text) => set({ text }),
  title: '',
  setTitle: (title) => set({ title }),
}));
