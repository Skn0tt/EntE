// Source: https://davidwalsh.name/fill-array-javascript
export const fillRange = (start: number, end: number) => {
  return Array<number>(end - start + 1)
    .fill(0)
    .map((_, index) => start + index);
};
