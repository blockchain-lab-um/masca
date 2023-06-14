export const qsCustomDecoder = (str: string) => {
  const keywords = {
    true: true,
    false: false,
    null: null,
    undefined,
  };

  const keys = ['true', 'false', 'null', 'undefined'];

  if (keys.includes(str)) {
    return keywords[str as keyof typeof keywords];
  }

  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
};
