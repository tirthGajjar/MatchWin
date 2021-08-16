import Button from "@/components/buttons/Button";
import { IGameStateContext } from "@/types/game-state";
import { RefreshIcon } from "@heroicons/react/outline";
import { useGameState } from "context/GameState";
import dynamic from "next/dynamic";
import React from "react";

const DynamicLevels = dynamic(
  () => import("@/components/game-progress/Levels"),
  {
    ssr: false,
  }
);

const DynamicScore = dynamic(() => import("@/components/game-progress/Score"), {
  ssr: false,
});

interface Props {}

const Header = (props: Props) => {
  const {
    gameState: { passedLevels, currentLevel, currentScore },
    replayLevel,
    makeAMove,
    resetGame,
    moveToNextLevel,
    setCurrentLevel,
  } = useGameState() as Required<IGameStateContext>;
  return (
    <div className="bg-gray-800 pb-32">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="border-b border-gray-700">
          <div className="flex flex-col items-end py-8 px-4 sm:px-0 space-y-4 divide-y-2 divide-gray-600">
            <div className="flex flex-row w-full items-end justify-between">
              <h1 className="text-4xl font-medium text-white">
                Welcome back! Gamer{" "}
                <span role="img" aria-hidden="true" aria-label="hello">
                  👋
                </span>
              </h1>
              <Button
                Icon={RefreshIcon}
                size="DEFAULT"
                type="PRIMARY"
                onClick={resetGame}
              >
                Reset
              </Button>
            </div>
            <div className="flex flex-row w-full items-end justify-between pt-6">
              <DynamicLevels
                passedLevels={passedLevels}
                currentLevel={currentLevel}
                setCurrentLevel={setCurrentLevel}
              />
              <DynamicScore score={currentScore}></DynamicScore>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
