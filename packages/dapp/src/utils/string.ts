const convertWords = (types: string[]): string[] => {
  const formattedTypes = types.map((type) => {
    return type.replace(/([A-Z]+)/g, ' $1').replace(/([A-Z][a-z])/g, ' $1');
  });
  return formattedTypes;
};

export const convertTypes = (types: string | string[] | undefined): string => {
  let result = '';
  if (types) {
    if (typeof types === 'string') {
      [result] = convertWords([types]);
    } else {
      result = convertWords(types).reverse().join(', ');
    }
  }
  return result;
};

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text).catch(() => {});
};
