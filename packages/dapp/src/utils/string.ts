const convertWords = (types: string[]): string[] => {
  const formattedTypes = types.map((type) =>
    type
      .replace(/([A-Z]+)/g, ' $1')
      .replace(/([A-Z][a-z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim()
  );
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

export const camelToTitleCase = (key: string): string => {
  const result = key.replace(/([a-z])([A-Z])/g, '$1 $2');
  return result.charAt(0).toUpperCase() + result.slice(1);
};
