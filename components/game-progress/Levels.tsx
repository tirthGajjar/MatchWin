import { GameLevel } from "@/types/game";
import { LockClosedIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React from "react";

interface Props {
  passedLevels: number;
  currentLevel: number;
  setCurrentLevel: (level: GameLevel) => any;
}

const levelNames = Array.from({ length: 10 }, (x, i) => i + 1);

const Levels = ({ passedLevels, currentLevel = 0, setCurrentLevel }: Props) => {
  return (
    <div className="text-white text-base flex flex-col space-y-2">
      <div className="rounded-md font-medium text-gray-200 text-base">
        Levels
      </div>

      <div className="flex space-x-4">
        <div className="flex space-x-4 items-center">
          {levelNames.slice(0, passedLevels + 1).map((levelName) => (
            <button
              key={levelName}
              className={clsx(
                levelName === currentLevel
                  ? "text-3xl bg-yellow-300 text-gray-800 h-12 w-12"
                  : "text-2xl bg-green-600 bg-opacity-80 h-10 w-10",
                "font-mono tracking-widest font-medium rounded-md flex items-center justify-center"
              )}
              onClick={() => setCurrentLevel(levelName as GameLevel)}
            >
              <span>{levelName}</span>
            </button>
          ))}
          {levelNames.slice(passedLevels + 1).map((levelName) => (
            <button
              key={levelName}
              disabled
              className="text-2xl relative bg-indigo-600 bg-opacity-80 h-10 w-10 font-mono tracking-widest font-medium rounded-md flex items-center justify-center"
            >
              <div className="w-full h-full absolute inset-0  rounded-md bg-opacity-80 flex items-center justify-center">
                <LockClosedIcon className="w-6 h-6 text-gray-200" />
              </div>
              <span className="text-opacity-20 text-gray-200">{levelName}</span>
            </button>
          ))}
        </div>

        {/* <div className="py-2 px-2">
          <LockClosedIcon className="w-6 h-6 text-gray-200" />
        </div> */}
      </div>
    </div>
  );
};

export default Levels;
