export const hasOwnProperty = (
  obj: Record<string, unknown>,
  ...keys: string[]
): boolean => {
  return keys.some((x) => Object.prototype.hasOwnProperty.call(obj, x));
};

export const isPlainObject = (value) =>
  value && [undefined, Object].includes(value.constructor);
