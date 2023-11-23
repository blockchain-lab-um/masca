import { QueryCredentialsRequestResult } from '@blockchain-lab-um/masca-connector';
import { FilterFn, Table } from '@tanstack/react-table';

export const includesDataStore: FilterFn<any> = (
  row,
  _: string,
  value: string[]
) => {
  const item = row.getValue('data_store');
  const itemArr = (item as string).split(',');
  let matching = false;

  for (const val of value) {
    if (itemArr.indexOf(val) >= 0) {
      matching = true;
      break;
    }
  }

  return matching;
};

export const includesType: FilterFn<any> = (
  row,
  _: string,
  value: string[]
) => {
  const item = row.original.data.type;
  let matching = false;

  for (const val of value) {
    if (typeof item === 'string' && item === val) {
      matching = true;
      break;
    } else if (Array.isArray(item) && item.indexOf(val) >= 0) {
      matching = true;
      break;
    }
  }

  return matching;
};

export const includesEcosystem: FilterFn<any> = (
  row,
  _: string,
  value: string[]
) => {
  let item = row.original.data.issuer;
  if (!item) return false;
  if (typeof item !== 'string') {
    item = item.id;
  }
  let matching = false;

  for (const val of value) {
    if (typeof item !== 'string') break;
    if (
      val === 'other' &&
      item.split(':')[1] !== 'ebsi' &&
      item.split(':')[1] !== 'polygonid'
    ) {
      matching = true;
      break;
    }
    if (item.split(':')[1] === val) {
      matching = true;
      break;
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
  console.log('here...');
  if (!value) return false;
  const item =
    columnId === 'credential_subject'
      ? JSON.parse(row.getValue(columnId))
      : row.getValue(columnId)?.toString()?.toLowerCase();

  return search(item, value);
};

export const selectRows = (
  table: Table<QueryCredentialsRequestResult>,
  selectedVCs: QueryCredentialsRequestResult[]
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
