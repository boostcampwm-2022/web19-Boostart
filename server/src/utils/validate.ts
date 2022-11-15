export const generateUnionTypeChecker = (...values: string[]) => {
  return (value: unknown): boolean => {
    if (typeof value !== 'string') return false;
    return values.includes(value);
  };
};
