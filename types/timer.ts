export type RestartTimerAction = (
  newExpiryTimestamp: number,
  newAutoStart?: boolean
) => void;
