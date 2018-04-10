const AUGUST = 8 - 1;

const currentMonth = () => new Date().getMonth();
const currentYear = () => new Date().getFullYear();

export const lastAugustFirst = (): Date => {
  const year = currentMonth() < AUGUST ? currentYear() - 1 : currentYear();

  return new Date(year, AUGUST, 1);
};

export const thisTerm = () => ({ date: { $gte: lastAugustFirst() } });

export const omitPassword =
  "-password -resetPasswordExpires -resetPasswordToken";
