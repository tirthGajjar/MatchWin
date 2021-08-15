import { shuffle, uniqueId } from "lodash";
import { links } from "./image-links";

type PrependNextNum<A extends Array<unknown>> = A["length"] extends infer T
  ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
    ? X
    : never
  : never;

type EnumerateInternal<A extends Array<unknown>, N extends number> = {
  0: A;
  1: EnumerateInternal<PrependNextNum<A>, N>;
}[N extends A["length"] ? 0 : 1];

export type Enumerate<N extends number> = EnumerateInternal<
  [],
  N
> extends (infer E)[]
  ? E
  : never;

export type Range<FROM extends number, TO extends number> = Exclude<
  Enumerate<TO>,
  Enumerate<FROM>
>;

export type GAME_LEVELS = Range<1, 11>;

export type CardData = {
  id: number | string;
  uniqueId?: number | string;
  src: string;
  isRevealed: boolean;
};

interface IGenerateCardsParams {
  difficulty: "EASY" | "MEDIUM" | "DIFFICULT";
  level: GAME_LEVELS;
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

  console.log({ totalCards, unEqualCards, result });
  return result;
};

export const getNumberOfCardsForLevel = (level: GAME_LEVELS) => {
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

export const getConstraints = (level: GAME_LEVELS) => {
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
  console.log(
    Math.round(
      (level * previousScore + ((movesLeft + 2) / movesLimit) * 10) / level > 1
        ? level + 1
        : level
    )
  );
  const res = Math.round(
    (previousScore +
      ((movesLeft + 2) / movesLimit) * 10 * (level <= 4 ? 1 : 1 + level / 10)) /
      (level === 1 ? 1 : 2)
  );
  return Math.min(10, res);
};
