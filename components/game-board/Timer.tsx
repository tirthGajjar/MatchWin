import React from "react";

interface Props {
  expiresIn: {
    seconds: number;
    minutes: number;
  };
}

const Timer = ({ expiresIn }: Props) => {
  const { seconds, minutes } = expiresIn;

  return (
    <div className="space-y-2">
      <div className="rounded-md  font-medium text-gray-600 text-base">
        Time left:
      </div>
      <div className="shadow-lg rounded-md h-12 px-4 bg-gradient-to-tr from-pink-100 to-lime-300 text-gray-700 font-calc text-4xl flex items-center justify-center tracking-widest space-x-1">
        <span>{String(minutes).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>
    </div>
  );
};

export default Timer;
