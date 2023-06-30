import { QueryVCsRequestResult } from '@blockchain-lab-um/masca-types';
import { FilterFn, Table } from '@tanstack/react-table';

export const includesDataStore: FilterFn<any> = (
  row,
  columnId: string,
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

function recursiveSearch(obj: any, searchString: string): boolean {
  if (typeof obj === 'string') return obj.includes(searchString);
  if (typeof obj === 'number') return obj.toString() === searchString;
  if (Array.isArray(obj))
    return obj.some((item: any) => recursiveSearch(item, searchString));
  return Object.keys(obj).some((key) => {
    const value = obj[key];

    if (typeof value === 'string') return value.includes(searchString);
    if (typeof value === 'number') return value.toString() === searchString;
    if (Array.isArray(value))
      return value.some((item: any) => recursiveSearch(item, searchString));
    if (typeof value === 'object' && value !== null)
      return recursiveSearch(value, searchString);
    return false;
  });
}

export const recursiveIncludes: FilterFn<any> = (
  row,
  columnId: string,
  value: string
) => {
  if (!value) return false;
  const item =
    columnId === 'credential_subject'
      ? JSON.parse(row.getValue(columnId))
      : row.getValue(columnId)?.toString()?.toLowerCase();
  if (recursiveSearch(item, value)) return true;
  return false;
};

export const selectRows = (
  table: Table<QueryVCsRequestResult>,
  selectedVCs: QueryVCsRequestResult[]
) => {
  table.getPrePaginationRowModel().rows.forEach((row) => {
    if (
      selectedVCs.filter((vc) => vc.metadata.id === row.original.metadata.id)
        .length > 0
    ) {
      row.toggleSelected(true);
    }
  });
};
