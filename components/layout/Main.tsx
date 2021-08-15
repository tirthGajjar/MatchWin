import { Button } from "@/components/Button";
import PlayCard from "@/components/PlayCard";
import { RefreshIcon } from "@heroicons/react/outline";
import { PlayIcon } from "@heroicons/react/solid";
import { useGameState } from "context/GameState";
import dynamic from "next/dynamic";
import React from "react";
import Moves from "../Timer/Moves";
import Timer from "../Timer/Timer";

const DynamicLevels = dynamic(() => import("components/Levels"), {
  ssr: false,
});

const DynamicScore = dynamic(() => import("components/Timer/Score"), {
  ssr: false,
});

interface Props {}

const Main = (props: Props) => {
  const { gameState, replayLevel, makeAMove, resetGame, moveToNextLevel } =
    useGameState();
  return (
    <div>
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
                  passedLevels={gameState.passedLevels}
                  currentLevel={gameState.currentLevel}
                />
                <DynamicScore score={gameState.currentScore}></DynamicScore>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          {/* Replace with your content */}

          <div className="bg-gray-100 rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-5 gap-8 sticky top-4 z-10 bg-white pb-4 px-4 rounded-md mb-2">
              <div>
                <Moves movesLeft={gameState.movesLeft}></Moves>
              </div>
              <div>
                <Timer expiresIn={gameState.timer}></Timer>
              </div>
              {gameState.hasWon && (
                <div className="col-span-3 flex justify-end space-x-8 items-end my-2">
                  <div className="text-3xl font-medium">
                    Level cleared 🎊🎉🎈
                  </div>
                  <div>
                    <Button
                      size="MEDIUM"
                      type="PRIMARY"
                      Icon={PlayIcon}
                      onClick={moveToNextLevel}
                    >
                      Play next
                    </Button>
                  </div>
                </div>
              )}
              {gameState.isGameOver && (
                <div className="col-span-3 flex justify-end space-x-8 items-end my-2">
                  <div className="text-3xl font-medium">Level failed! 😟😓</div>
                  <div>
                    <Button
                      size="MEDIUM"
                      type="PRIMARY"
                      Icon={RefreshIcon}
                      onClick={replayLevel}
                    >
                      Replay
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className=" pt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-6 xl:gap-x-8">
              {gameState.cards.map(({ id, src, isRevealed, uniqueId }) => (
                <PlayCard
                  key={uniqueId}
                  src={src}
                  isDisabled={gameState.hasWon || gameState.isGameOver}
                  isRevealed={isRevealed}
                  setRevealed={(newRevealedState) =>
                    makeAMove!({ cardId: id, uniqueId })
                  }
                />
              ))}
            </div>
          </div>
          {/* /End replace */}
        </div>
      </main>
    </div>
  );
};

export default Main;
