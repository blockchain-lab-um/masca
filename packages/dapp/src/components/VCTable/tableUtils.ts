import { QueryVCsRequestResult } from '@blockchain-lab-um/masca-connector';
import { FilterFn, Table } from '@tanstack/react-table';

export const includesDataStore: FilterFn<any> = (
  row,
  _: string,
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

const extractValues = (obj: any): string[] => {
  if (typeof obj === 'string') return [obj.toLowerCase()];
  if (typeof obj === 'number') return [obj.toString()];
  if (typeof obj === 'boolean') return [obj.toString()];
  if (obj === null) return ['null'];
  if (obj === undefined) return ['undefined'];
  return Object.values(obj).flatMap((value) => extractValues(value));
};

function search(obj: any, searchString: string): boolean {
  const values = extractValues(obj);
  return values.some((value) => value.includes(searchString.toLowerCase()));
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

  return search(item, value);
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
