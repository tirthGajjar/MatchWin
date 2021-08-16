import { CardData, GameLevel } from "@/types/game";
import { IGameState } from "@/types/game-state";
import { RestartTimerAction } from "@/types/timer";
import { links } from "@/utils/constants";
import { shuffle, uniqueId } from "lodash";

interface IGenerateCardsParams {
  difficulty: "EASY" | "MEDIUM" | "DIFFICULT";
  level: GameLevel;
}

export const generateCards = ({
  difficulty = "EASY",
  level = 1,
}: IGenerateCardsParams) => {
  const totalCards = getNumberOfCardsForLevel(level);
  const unEqualCards = getUnEqualCardsForDifficultyAndLevel(
    links,
    difficulty,
    totalCards
  );

  const duplicatedCards = shuffle(unEqualCards).splice(
    0,
    totalCards - unEqualCards.length
  );

  const result = shuffle(
    unEqualCards
      .concat(duplicatedCards)
      .map((card) => ({ ...card, uniqueId: uniqueId("card-") }))
  );
  return result;
};

export const getNumberOfCardsForLevel = (level: GameLevel) => {
  return level * 4;
};

export const getUnEqualCardsForDifficultyAndLevel = (
  data: CardData[],
  difficulty: "EASY" | "MEDIUM" | "DIFFICULT",
  totalCards: number
): CardData[] => {
  switch (difficulty) {
    case "EASY":
      return data.slice(0, Math.round(totalCards * 0.75));
    case "MEDIUM":
      return data.slice(0, Math.round(totalCards * 0.8));
    case "DIFFICULT":
      return data.slice(0, Math.round(totalCards * 0.9));
  }
};

export const getConstraints = (level: GameLevel) => {
  return {
    timeLimit: level * 10,
    movesLimit: level * 2 + 1,
  };
};

export const calculateScore = (
  movesLimit: number,
  movesLeft: number,
  level: number,
  previousScore: number
) => {
  const res = Math.round(
    (previousScore +
      ((movesLeft + 2) / movesLimit) * 10 * (level <= 4 ? 1 : 1 + level / 10)) /
      (level === 1 ? 1 : 2)
  );
  return Math.min(10, res);
};

export const getStateForLevel = (
  state: IGameState,
  level: GameLevel
): IGameState => {
  const { timeLimit, movesLimit } = getConstraints(level as GameLevel);

  return {
    ...state,
    cards: generateCards({
      difficulty: "EASY",
      level: level,
    }),
    revealedCards: {},
    timeLimit,
    movesLimit,
    movesLeft: movesLimit,
    hasWon: false,
    isGameOver: false,
    currentLevel: level,
  };
};

export const restartTimer = (
  restart: RestartTimerAction,
  timeLimit: number
) => {
  typeof restart === "function" &&
    restart(new Date().setSeconds(new Date().getSeconds() + timeLimit), false);
};
