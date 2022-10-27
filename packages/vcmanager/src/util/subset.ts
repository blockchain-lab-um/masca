/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export const isSubset = (superset: any, subset: any) => {
  if (
    typeof superset !== 'object' ||
    superset === null ||
    typeof subset !== 'object' ||
    subset === null
  )
    return false;

  return Object.keys(subset).every((key) => {
    if (!superset.propertyIsEnumerable(key)) return false;

    const subsetItem = subset[key];
    const supersetItem = superset[key];
    if (
      typeof subsetItem === 'object' && subsetItem !== null
        ? !isSubset(supersetItem, subsetItem)
        : supersetItem !== subsetItem
    )
      return false;

    return true;
  });
};
