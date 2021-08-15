import {
  calculateScore,
  CardData,
  generateCards,
  getConstraints,
} from "@/utils/generate-cards";
import useTimer from "hooks/useTimer";
import React, { Dispatch, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { GAME_LEVELS, getStateForLevel } from "../utils/generate-cards";

export interface IGameState {
  currentLevel: GAME_LEVELS;
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
  MOVE_TO_NEXT_LEVEL = "MOVE_TO_NEXT_LEVEL",
  REPLAY_LEVEL = "REPLAY_LEVEL",
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
    newStage: GAME_LEVELS;
  };
}

interface IChangeToPrevLevelAction extends ReducerAction {
  type: ReducerActionKind.CHANGE_TO_PREVIOUS_LEVEL;
  payload: {
    newStage: GAME_LEVELS;
  };
}

interface ISetMovesLeftAction extends ReducerAction {
  type: ReducerActionKind.DECREMENT_MOVES_LEFT;
}

interface IResetGameAction extends ReducerAction {
  type: ReducerActionKind.RESET_GAME;
}

interface IMoveToNextLevelAction extends ReducerAction {
  type: ReducerActionKind.MOVE_TO_NEXT_LEVEL;
  payload: {
    restart: (newExpiryTimestamp: number, newAutoStart?: boolean) => void;
  };
}

interface IReplayLevelAction extends ReducerAction {
  type: ReducerActionKind.REPLAY_LEVEL;
  payload: {
    restart: (newExpiryTimestamp: number, newAutoStart?: boolean) => void;
  };
}

interface IMakeMoveAction extends ReducerAction {
  type: ReducerActionKind.MAKE_A_MOVE;
  payload: {
    cardId: number | string;
    uniqueId?: number | string;
    restart: (newExpiryTimestamp: number, newAutoStart?: boolean) => void;
    start?: () => void;
    pause?: () => void;
  };
}

export type ReducerActionsSet =
  | IChangeToNextLevelAction
  | IChangeToPrevLevelAction
  | ISetMovesLeftAction
  | IMoveToNextLevelAction
  | IMakeMoveAction
  | IReplayLevelAction
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
    cards: generateCards({ level: newCurrentLevel, difficulty: "EASY" }),
    revealedCards: {},
    isGameOver: false,
    timeLimit,
    movesLimit,
    movesLeft: movesLimit,
    hasWon: false,
  };
};

const gameStateReducer = (
  state: IGameState,
  action: ReducerActionsSet
): IGameState => {
  switch (action.type) {
    case ReducerActionKind.CHANGE_TO_NEXT_LEVEL:
      return { ...state, currentLevel: action.payload.newStage };

    case ReducerActionKind.CHANGE_TO_PREVIOUS_LEVEL:
      return { ...state, currentLevel: action.payload.newStage };

    case ReducerActionKind.MOVE_TO_NEXT_LEVEL:
      return state.hasWon ? onLevelWin(state, action.payload.restart) : state;

    case ReducerActionKind.REPLAY_LEVEL:
      const { restart } = action.payload;
      const { timeLimit, movesLimit } = getConstraints(
        state.currentLevel as GAME_LEVELS
      );

      restart!(
        new Date().setSeconds(new Date().getSeconds() + timeLimit),
        false
      );
      return {
        ...state,
        cards: generateCards({
          difficulty: "EASY",
          level: state.currentLevel as GAME_LEVELS,
        }),
        revealedCards: {},
        timeLimit,
        movesLimit,
        movesLeft: movesLimit,
        hasWon: false,
        isGameOver: false,
      };

    case ReducerActionKind.MAKE_A_MOVE:
      const { cardId, uniqueId, start, pause } = action.payload;
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

      const hasWon = !state.hasWon ? state.revealedCards[cardId] : false;

      if (hasWon) {
        pause!();
      }

      const newState = {
        ...state,
        cards: newCards,
        revealedCards: { ...state.revealedCards, [cardId]: true },
        hasWon,
        movesLeft: newMovesLeft,
        isGameOver: newMovesLeft > 0 ? state.isGameOver : !hasWon,
        passedLevels:
          hasWon && state.currentLevel > state.passedLevels
            ? Math.min(10, state.currentLevel)
            : state.passedLevels,
        currentScore: hasWon
          ? calculateScore(
              state.movesLimit,
              state.movesLeft,
              state.currentLevel,
              state.currentScore
            )
          : state.currentScore,
      };

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
  moveToNextLevel?: () => void;
  replayLevel?: () => void;
}>({ gameState: initialState });

function GameStateProvider({ ...props }) {
  const [savedState, saveState] = useLocalStorage("GAME-STATE", {
    passedLevels: 0,
    currentScore: 0,
  });

  const reducerLocalStorage = useCallback(
    (state, action) => {
      const newState = gameStateReducer(state, action);

      saveState({
        passedLevels: newState.passedLevels,
        currentScore: newState.currentScore,
      });

      return newState;
    },
    [saveState]
  );

  const [gameState, actionsDispatcher] = React.useReducer(reducerLocalStorage, {
    ...getStateForLevel(
      initialState,
      (savedState?.passedLevels + 1) as GAME_LEVELS
    ),
    ...savedState,
  });

  const { seconds, minutes, restart, start, pause } = useTimer({
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
      payload: { cardId, uniqueId, restart, start, pause },
    });

  const resetGame = () => {
    restart(
      new Date().setSeconds(new Date().getSeconds() + initialState.timeLimit),
      false
    );
    actionsDispatcher({ type: ReducerActionKind.RESET_GAME });
  };

  const moveToNextLevel = () => {
    actionsDispatcher({
      type: ReducerActionKind.MOVE_TO_NEXT_LEVEL,
      payload: { restart },
    });
  };

  const replayLevel = () => {
    actionsDispatcher({
      type: ReducerActionKind.REPLAY_LEVEL,
      payload: { restart },
    });
  };

  const value = {
    gameState,
    actionsDispatcher,
    makeAMove,
    resetGame,
    moveToNextLevel,
    replayLevel,
  };
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
