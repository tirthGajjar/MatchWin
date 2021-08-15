export const getTimeFromSeconds = (secs: number) => {
  const totalSeconds = Math.ceil(secs);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return {
    seconds,
    minutes,
    hours,
    days,
  };
};

export const getSecondsFromExpiry = (expiry: number, shouldRound?: boolean) => {
  const now = new Date().getTime();
  const millisecondsDistance = expiry - now;
  if (millisecondsDistance > 0) {
    const val = millisecondsDistance / 1000;
    return shouldRound ? Math.round(val) : val;
  }
  return 0;
};

export const getSecondsFromPrevTime = (
  prevTime: number,
  shouldRound: boolean
) => {
  const now = new Date().getTime();
  const millisecondsDistance = now - prevTime;
  if (millisecondsDistance > 0) {
    const val = millisecondsDistance / 1000;
    return shouldRound ? Math.round(val) : val;
  }
  return 0;
};

export const getSecondsFromTimeNow = () => {
  const now = new Date();
  const currentTimestamp = now.getTime();
  const offset = now.getTimezoneOffset() * 60;
  return currentTimestamp / 1000 - offset;
};

export const getFormattedTimeFromSeconds = (
  totalSeconds: number,
  format: string
) => {
  const {
    seconds: secondsValue,
    minutes,
    hours,
  } = getTimeFromSeconds(totalSeconds);
  let AM_PM = "";
  let hoursValue = hours;

  if (format === "12-hour") {
    AM_PM = hours >= 12 ? "pm" : "am";
    hoursValue = hours % 12;
  }

  return {
    seconds: secondsValue,
    minutes,
    hours: hoursValue,
    ampm: AM_PM,
  };
};

export const validateExpiryTimestamp = (expiryTimestamp: number) => {
  const isValid = new Date(expiryTimestamp).getTime() > 0;
  if (!isValid) {
    console.warn(
      "react-timer-hook: { useTimer } Invalid expiryTimestamp settings",
      expiryTimestamp
    ); // eslint-disable-line
  }
  return isValid;
};

export const validateOnExpire = (onExpire: () => any) => {
  const isValid = onExpire && typeof onExpire === "function";
  if (onExpire && !isValid) {
    console.warn(
      "react-timer-hook: { useTimer } Invalid onExpire settings function",
      onExpire
    ); // eslint-disable-line
  }
  return isValid;
};
