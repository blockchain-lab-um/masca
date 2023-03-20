import { QueryVCsRequestResult } from '@blockchain-lab-um/ssi-snap-types';
import { FilterFn, Table } from '@tanstack/react-table';

export const includesDataStore: FilterFn<any> = (
  row,
  columnId,
  value: string[]
) => {
  const item = row.getValue('data_store');
  const itemArr = (item as string).split(',');
  let matching = false;
  for (let i = 0; i < value.length; i += 1) {
    if (itemArr.indexOf(value[i]) >= 0) {
      matching = true;
    }
  }
  return matching;
};

export const selectRows = (
  table: Table<QueryVCsRequestResult>,
  selectedVCs: QueryVCsRequestResult[]
) => {
  // TODO only check IDs after snap bug is fixed (join same VCs with different stores)
  table.getPrePaginationRowModel().rows.forEach((row) => {
    if (
      selectedVCs.filter(
        (vc) =>
          vc.metadata.id === row.original.metadata.id &&
          vc.metadata.store === row.original.metadata.store
      ).length > 0
    ) {
      row.toggleSelected(true);
    }
  });
};
