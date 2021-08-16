import Button from "@/components/buttons/Button";
import Moves from "@/components/game-board/Moves";
import PlayCard from "@/components/game-board/PlayCard";
import Timer from "@/components/game-board/Timer";
import { IGameStateContext } from "@/types/game-state";
import { PlayIcon, RefreshIcon } from "@heroicons/react/outline";
import { useGameState } from "context/GameState";
import React from "react";

const GameBoard = () => {
  const {
    gameState: { movesLeft, timer, hasWon, isGameOver, cards },
    replayLevel,
    makeAMove,
    moveToNextLevel,
  } = useGameState() as Required<IGameStateContext>;
  return (
    <div className="bg-gray-100 rounded-lg shadow px-5 py-6 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-5 gap-8 sticky top-4 z-10 bg-white pb-4 px-4 rounded-md mb-2">
        <div>
          <Moves movesLeft={movesLeft}></Moves>
        </div>
        <div>
          <Timer expiresIn={timer}></Timer>
        </div>
        {hasWon && (
          <div className="col-span-3 flex justify-end space-x-8 items-end my-2">
            <div className="text-3xl font-medium">Level cleared 🎊🎉🎈</div>
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
        {isGameOver && (
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
        {cards.map(({ id, src, isRevealed, uniqueId }) => (
          <PlayCard
            key={uniqueId}
            src={src}
            isDisabled={hasWon || isGameOver}
            isRevealed={isRevealed}
            setRevealed={(newRevealedState) =>
              makeAMove!({ cardId: id, uniqueId })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
