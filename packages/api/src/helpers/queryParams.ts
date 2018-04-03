export const thisYear = {
  date: { $gte: new Date(+new Date() - 365 * 24 * 60 * 60 * 1000) }
};
