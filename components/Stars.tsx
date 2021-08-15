import { StarIcon } from "@heroicons/react/solid";
import React from "react";

interface Props {
  total?: number;
  score?: number;
}

const Stars = ({ total = 10, score = 0 }: Props) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(score)].map((_, index) => (
        <StarIcon
          key={index}
          className="w-5 h-5 fill-current text-yellow-500 rotate-12"
        />
      ))}
      {[...Array(Math.abs(total - score))].map((_, index) => (
        <StarIcon key={index} className="w-5 h-5 fill-current text-gray-400" />
      ))}
    </div>
  );
};

export default Stars;
