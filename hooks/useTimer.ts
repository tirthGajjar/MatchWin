// taken from https://github.com/amrlabib/react-timer-hook/blob/master/src/useTimer.js

import {
  getSecondsFromExpiry,
  getTimeFromSeconds,
  validateExpiryTimestamp,
  validateOnExpire,
} from "@/utils/timer";
import { useState } from "react";
import useInterval from "./useInterval";

const DEFAULT_DELAY = 1000;
function getDelayFromExpiryTimestamp(expiryTimestamp: number) {
  if (!validateExpiryTimestamp(expiryTimestamp)) {
    return null;
  }

  const seconds = getSecondsFromExpiry(expiryTimestamp);
  const extraMilliseconds = Math.floor((seconds - Math.floor(seconds)) * 1000);
  return extraMilliseconds > 0 ? extraMilliseconds : DEFAULT_DELAY;
}

export default function useTimer({
  expiryTimestamp: expiry,
  onExpire,
  onInterval,
  autoStart = false,
}: {
  expiryTimestamp: number;
  onExpire: () => any;
  onInterval?: ({
    seconds,
    minutes,
    hours,
    days,
  }: {
    seconds: number;
    minutes: number;
    hours: number;
    days: number;
  }) => any;
  autoStart?: boolean;
}) {
  const [expiryTimestamp, setExpiryTimestamp] = useState(expiry);
  const [seconds, setSeconds] = useState(getSecondsFromExpiry(expiryTimestamp));
  const [isRunning, setIsRunning] = useState(autoStart);
  const [didStart, setDidStart] = useState(autoStart);
  const [delay, setDelay] = useState(
    getDelayFromExpiryTimestamp(expiryTimestamp)
  );

  function handleExpire() {
    validateOnExpire(onExpire) && onExpire();
    setIsRunning(false);
    setDelay(null);
  }

  function pause() {
    setIsRunning(false);
  }

  function restart(newExpiryTimestamp: number, newAutoStart = true) {
    setDelay(getDelayFromExpiryTimestamp(newExpiryTimestamp));
    setDidStart(newAutoStart);
    setIsRunning(newAutoStart);
    setExpiryTimestamp(newExpiryTimestamp);
    setSeconds(getSecondsFromExpiry(newExpiryTimestamp));
  }

  function resume() {
    const time = new Date();
    time.setMilliseconds(time.getMilliseconds() + seconds * 1000);
    restart(time.getTime());
  }

  function start() {
    if (didStart) {
      setSeconds(getSecondsFromExpiry(expiryTimestamp));
      setIsRunning(true);
    } else {
      resume();
    }
  }

  useInterval(
    () => {
      if (delay !== DEFAULT_DELAY) {
        setDelay(DEFAULT_DELAY);
      }
      const secondsValue = getSecondsFromExpiry(expiryTimestamp);
      setSeconds(secondsValue);
      if (secondsValue <= 0) {
        handleExpire();
      }
      typeof onInterval === "function" &&
        onInterval({ ...getTimeFromSeconds(seconds) });
    },
    isRunning ? delay : null
  );

  return {
    ...getTimeFromSeconds(seconds),
    start,
    pause,
    resume,
    restart,
    isRunning,
  };
}
