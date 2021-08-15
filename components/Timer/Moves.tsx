import React from "react";

interface Props {
  movesLeft: number;
}

const Moves = ({ movesLeft }: Props) => {
  return (
    <div className="space-y-2">
      <div className="rounded-md font-medium text-gray-600 text-base">
        Moves left:
      </div>
      <div className="shadow-lg rounded-md h-12 px-4 bg-gradient-to-tr from-pink-100 to-indigo-300 text-gray-700 font-calc text-4xl flex items-center justify-center tracking-widest space-x-1">
        {String(movesLeft).padStart(2, "0")}
      </div>
    </div>
  );
};

export default Moves;
