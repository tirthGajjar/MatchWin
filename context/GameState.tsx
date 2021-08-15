import {
  calculateScore,
  CardData,
  generateCards,
  getConstraints,
} from "@/utils/generate-cards";
import useTimer from "hooks/useTimer";
import React, { Dispatch } from "react";
import { GAME_LEVELS } from "../utils/generate-cards";

export interface IGameState {
  currentLevel: number;
  passedLevels: number;
  movesLeft: number;
  currentScore: number;
  isGameOver: boolean;
  cards: CardData[];
  timeLimit: number;
  movesLimit: number;
  timer: {
    seconds: number;
    minutes: number;
  };
  revealedCards: {
    [x: string]: boolean;
  };
  hasWon: boolean;
}

// An enum with all the types of actions to use in our reducer
export enum ReducerActionKind {
  CHANGE_TO_NEXT_LEVEL = "CHANGE_TO_NEXT_LEVEL",
  CHANGE_TO_PREVIOUS_LEVEL = "CHANGE_TO_PREVIOUS_LEVEL",
  DECREMENT_MOVES_LEFT = "DECREMENT_MOVES_LEFT",
  RESTART = "RESTART",
  SET_PASSED_LEVEL = "SET_PASSED_LEVEL",
  MAKE_A_MOVE = "MAKE_A_MOVE",
  RESET_GAME = "RESET_GAME",
}

// An interface for our actions
interface ReducerAction {
  type: ReducerActionKind;
  payload?: any;
}

interface IChangeToNextLevelAction extends ReducerAction {
  type: ReducerActionKind.CHANGE_TO_NEXT_LEVEL;
  payload: {
    newStage: number;
  };
}

interface IChangeToPrevLevelAction extends ReducerAction {
  type: ReducerActionKind.CHANGE_TO_PREVIOUS_LEVEL;
  payload: {
    newStage: number;
  };
}

interface ISetMovesLeftAction extends ReducerAction {
  type: ReducerActionKind.DECREMENT_MOVES_LEFT;
}

interface IResetGameAction extends ReducerAction {
  type: ReducerActionKind.RESET_GAME;
}

interface ISetPassedLevelAction extends ReducerAction {
  type: ReducerActionKind.SET_PASSED_LEVEL;
  payload: {
    newPassedLevel: number;
  };
}

interface IMakeMoveAction extends ReducerAction {
  type: ReducerActionKind.MAKE_A_MOVE;
  payload: {
    cardId: number | string;
    uniqueId?: number | string;
    restart: (newExpiryTimestamp: number, newAutoStart?: boolean) => void;
    start?: () => void;
  };
}

export type ReducerActionsSet =
  | IChangeToNextLevelAction
  | IChangeToPrevLevelAction
  | ISetMovesLeftAction
  | ISetPassedLevelAction
  | IMakeMoveAction
  | IResetGameAction;

const onLevelWin = (
  state: IGameState,
  restart:
    | ((newExpiryTimestamp: number, newAutoStart?: boolean | undefined) => void)
    | undefined
): IGameState => {
  const newCurrentLevel = (
    state.currentLevel < 10 ? state.currentLevel + 1 : 10
  ) as GAME_LEVELS;

  const { timeLimit, movesLimit } = getConstraints(newCurrentLevel);
  restart!(new Date().setSeconds(new Date().getSeconds() + timeLimit), false);

  return {
    ...state,
    currentLevel: newCurrentLevel,
    currentScore: calculateScore(
      state.movesLimit,
      state.movesLeft,
      state.currentLevel,
      state.currentScore
    ),
    cards: generateCards({ level: newCurrentLevel, difficulty: "EASY" }),
    revealedCards: {},
    passedLevels: newCurrentLevel - 1,
    isGameOver: false,
    timeLimit,
    movesLimit,
    movesLeft: movesLimit,
    hasWon: false,
  };
};

const counterReducer = (
  state: IGameState,
  action: ReducerActionsSet
): IGameState => {
  switch (action.type) {
    case ReducerActionKind.CHANGE_TO_NEXT_LEVEL:
      return { ...state, currentLevel: action.payload.newStage };

    case ReducerActionKind.CHANGE_TO_PREVIOUS_LEVEL:
      return { ...state, currentLevel: action.payload.newStage };

    case ReducerActionKind.SET_PASSED_LEVEL:
      return { ...state, passedLevels: action.payload.newPassedLevel };

    case ReducerActionKind.MAKE_A_MOVE:
      const { cardId, uniqueId, restart, start } = action.payload;
      const updatedCardIndex = state.cards.findIndex(
        (card) => card.uniqueId === uniqueId
      );
      const newCards = [...state.cards];
      newCards[updatedCardIndex] = {
        ...newCards[updatedCardIndex],
        isRevealed: true,
      };

      const currentMoves = state.movesLeft;
      let newMovesLeft = currentMoves <= 1 ? 0 : currentMoves - 1;

      if (currentMoves === state.movesLimit) {
        start!();
      }

      const newState = {
        ...state,
        cards: newCards,
        revealedCards: { ...state.revealedCards, [cardId]: true },
        hasWon: !state.hasWon ? state.revealedCards[cardId] : false,
        movesLeft: newMovesLeft,
        isGameOver: newMovesLeft > 0 ? state.isGameOver : false,
      };

      if (newState.hasWon) {
        return onLevelWin(newState, restart);
      }
      return newState;

    case ReducerActionKind.RESET_GAME:
      return {
        ...initialState,
      };

    default: {
      console.warn(`Unhandled action type: ${action}`);
      return state;
    }
  }
};

// Initial state that we pass into useReducer
const initialState: IGameState = {
  currentLevel: 1,
  passedLevels: 0,
  movesLeft: 3,
  currentScore: 0,
  isGameOver: false,
  cards: generateCards({ difficulty: "EASY", level: 1 }),
  ...getConstraints(1),
  timer: {
    seconds: 10,
    minutes: 0,
  },
  revealedCards: {},
  hasWon: false,
};

const GameContext = React.createContext<{
  gameState: IGameState;
  actionsDispatcher?: Dispatch<ReducerActionsSet>;
  makeAMove?: ({
    cardId,
    uniqueId,
  }: {
    cardId: number | string;
    uniqueId?: string | number | undefined;
  }) => void;
  resetGame?: () => void;
}>({ gameState: initialState });

function GameStateProvider({ ...props }) {
  const [gameState, actionsDispatcher] = React.useReducer(
    counterReducer,
    initialState
  );

  const { seconds, minutes, restart, start } = useTimer({
    expiryTimestamp: new Date().setSeconds(
      new Date().getSeconds() + gameState.timeLimit
    ),
    onExpire: () => console.warn("onExpire called"),
    autoStart: false,
  });

  gameState.timer = {
    seconds,
    minutes,
  };

  const makeAMove = ({
    cardId,
    uniqueId,
  }: {
    cardId: number | string;
    uniqueId?: number | string;
  }) =>
    actionsDispatcher({
      type: ReducerActionKind.MAKE_A_MOVE,
      payload: { cardId, uniqueId, restart, start },
    });

  const resetGame = () => {
    restart(
      new Date().setSeconds(new Date().getSeconds() + initialState.timeLimit),
      false
    );
    actionsDispatcher({ type: ReducerActionKind.RESET_GAME });
  };

  const value = { gameState, actionsDispatcher, makeAMove, resetGame };
  return <GameContext.Provider value={value} {...props} />;
}

function useGameState() {
  const context = React.useContext(GameContext);
  if (context === undefined) {
    throw new Error(`useGameState must be used within a GameStateProvider`);
  }
  return context;
}

export { GameStateProvider, useGameState };
