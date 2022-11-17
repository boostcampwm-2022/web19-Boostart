export const generateUnionTypeChecker = (enumObj) => {
  const keys = Object.keys(enumObj);
  keys.forEach((key) => {
    if (key !== enumObj[key]) throw new Error();
  });

  return (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    return keys.includes(value);
  };
};
