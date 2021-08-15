import React from "react";
import Stars from "../Stars";

interface Props {
  score: number;
}

const Score = ({ score }: Props) => {
  return (
    <div className="space-y-2">
      <div className="rounded-md font-medium text-gray-200 text-base">
        Score:
      </div>
      <div className="flex items-center justify-start">
        <Stars score={score} />
      </div>
    </div>
  );
};

export default Score;
