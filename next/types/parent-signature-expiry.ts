const days = 24 * 60 * 60 * 1000;

export const isValidParentSignatureExpiryTime = (v: number) => v >= 0;
export const isValidParentSignatureNotificationTime = (v: number) => v >= 0;

export const isParentSignatureExpiryEnabled = (v: number) => v !== 0;
export const isParentSignatureNotificationEnabled = (v: number) => v !== 0;

export const canEntryStillBeSigned = (
  entryDate: number,
  expiryTime: number
) => {
  if (!isParentSignatureExpiryEnabled(expiryTime)) {
    return true;
  }

  return Date.now() < getEntryExpirationTime(entryDate, expiryTime);
};

export const getEntryExpirationTime = (entryDate: number, expiryTime: number) =>
  entryDate + expiryTime;

export const DEFAULT_PARENT_SIGNATURE_EXPIRY_TIME = 14 * days;
export const DEFAULT_PARENT_SIGNATURE_NOTIFICATION_TIME = 7 * days;
