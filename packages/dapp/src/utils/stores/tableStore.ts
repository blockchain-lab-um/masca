import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { ColumnFiltersState } from '@tanstack/react-table';
import { create } from 'zustand';

interface TableStore {
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  selectedVCs: QueryVCsRequestResult[];
  cardView: boolean;
  setCardView: (view: boolean) => void;
  setSelectedVCs: (selectedVCs: QueryVCsRequestResult[]) => void;
  setColumnFilters: (columnFilters: ColumnFiltersState) => void;
  setGlobalFilter: (globalFilter: string) => void;
}

export const useTableStore = create<TableStore>()((set) => ({
  globalFilter: '',
  columnFilters: [{ id: 'data_store', value: ['snap', 'ceramic'] }],
  selectedVCs: [],
  cardView: true,
  setCardView: (cardView: boolean) => set({ cardView }),
  setSelectedVCs: (selectedVCs: QueryVCsRequestResult[]) =>
    set({ selectedVCs }),
  setColumnFilters: (columnFilters: ColumnFiltersState) =>
    set({ columnFilters }),
  setGlobalFilter: (globalFilter: string) => set({ globalFilter }),
}));
