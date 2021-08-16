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
  // 1. Get how many cards should be available in each level
  const totalCards = getNumberOfCardsForLevel(level);

  // 2. Get unique cards for the given level and difficulty setting
  const uniqueCards = getUniqueCardsForDifficultyAndLevel(
    links,
    difficulty,
    totalCards
  );

  const numberOfDuplicatedCardsToGenerate =
    totalCards - uniqueCards.length > 0 ? totalCards - uniqueCards.length : 1;

  // 3. Generate the remaining require cards by picking random cards from the unique cards set
  const duplicatedCards = shuffle(uniqueCards).splice(
    0,
    numberOfDuplicatedCardsToGenerate
  );

  // 4. Concat the duplicated cards and unique cards and shuffle them
  const result = shuffle(
    uniqueCards
      .concat(duplicatedCards)
      .map((card) => ({ ...card, uniqueId: uniqueId("card-") }))
  );
  return result;
};

// a very simple implementation for how many cards should be present in a given level
export const getNumberOfCardsForLevel = (level: GameLevel) => {
  return level * 4;
};

// generate unique cards for a given level and difficulty setting
export const getUniqueCardsForDifficultyAndLevel = (
  data: CardData[],
  difficulty: "EASY" | "MEDIUM" | "DIFFICULT",
  totalCards: number
): CardData[] => {
  switch (difficulty) {
    case "EASY":
      // for an "EASY" game, 75% of the total cards should be unique
      return data.slice(0, Math.round(totalCards * 0.75));
    case "MEDIUM":
      // for a "MEDIUM" game, 80% of the total cards should be unique
      return data.slice(0, Math.round(totalCards * 0.8));
    case "DIFFICULT":
      // for a "DIFFICULT" game, 90% of the total cards should be unique
      return data.slice(0, Math.round(totalCards * 0.9));
  }
};

// generate constraints for each level
export const getConstraints = (level: GameLevel) => {
  return {
    timeLimit: level * 10,
    movesLimit: level * 2 + 1,
  };
};

// calculate score in a non-linear fashion,
// a better implementation can be to utilize a Long Short Team Memory logic
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
