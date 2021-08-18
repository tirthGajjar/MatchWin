import useLocalStorage from "@/hooks/useLocalStorage";
import useTimer from "@/hooks/useTimer";
import { GameLevel } from "@/types/game";
import {
  IGameState,
  IGameStateContext,
  IMakeMoveAction,
  IReplayLevelAction,
  ReducerActionsSet,
} from "@/types/game-state";
import { RestartTimerAction } from "@/types/timer";
import {
  calculateScore,
  generateCards,
  getConstraints,
  getStateForLevel,
  restartTimer,
} from "@/utils/game-state-helpers";
import React, { useCallback } from "react";

// An enum with all the types of actions to use in our reducer
export enum ReducerActionKind {
  SET_CURRENT_LEVEL = "SET_CURRENT_LEVEL",
  CHANGE_TO_PREVIOUS_LEVEL = "CHANGE_TO_PREVIOUS_LEVEL",
  DECREMENT_MOVES_LEFT = "DECREMENT_MOVES_LEFT",
  RESTART = "RESTART",
  MOVE_TO_NEXT_LEVEL = "MOVE_TO_NEXT_LEVEL",
  REPLAY_LEVEL = "REPLAY_LEVEL",
  MAKE_A_MOVE = "MAKE_A_MOVE",
  RESET_GAME = "RESET_GAME",
  SET_GAME_OVER = "SET_GAME_OVER",
}

// reducer to execute when user has passed the level and is moving to the next level
const onLevelWin = (
  state: IGameState,
  restart: RestartTimerAction
): IGameState => {
  const newCurrentLevel = (
    state.currentLevel < 10 ? state.currentLevel + 1 : 10
  ) as GameLevel;

  const { timeLimit, movesLimit } = getConstraints(newCurrentLevel);
  restartTimer(restart, timeLimit);

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
    lastOpenedCard: "",
  };
};

// reducer to execute when user has clicked to reveal a card

const makeAMoveReducer = (state: IGameState, action: IMakeMoveAction) => {
  const { cardId, uniqueId, start, pause } = action.payload;

  // 1. Find and update card's revealed state
  // 1.1 find the card to to revealed
  const updatedCardIndex = state.cards.findIndex(
    (card) => card.uniqueId === uniqueId
  );

  // 1.2 create shallow copy of the original state
  const newCards = [...state.cards];

  // 1.3 update the found card's state
  newCards[updatedCardIndex] = {
    ...newCards[updatedCardIndex],
    isRevealed: true,
  };

  // 2. Calculate moves left
  const currentMoves = state.movesLeft;
  let newMovesLeft = currentMoves <= 1 ? 0 : currentMoves - 1;

  // 2.1 if this was the first move in the level -> start the timer
  if (currentMoves === state.movesLimit) {
    start!();
  }

  // 3. Check if the current move was a winning move for the level
  const hasWon = !state.hasWon
    ? state.lastOpenedCard !== "" && state.lastOpenedCard === cardId
    : false;

  let lastOpenedCard = cardId;

  // 4. Mark game as over if movesLeft == 0 and the move was not a winning one
  let isGameOver = state.lastOpenedCard === "" ? state.isGameOver : !hasWon;

  if (isGameOver) {
    let stateForLevel = getStateForLevel(state, state.currentLevel);
    restartTimer(action.payload.restart, stateForLevel.timeLimit);
    return stateForLevel;
  }

  // 5. Pause the timer,
  // 5.1 if use has won the level
  // 5.2 or user has run of moves
  if (hasWon || isGameOver) {
    pause!();
  }

  const newState = {
    ...state,
    cards: newCards,
    // set the current card as revealed
    revealedCards: { ...state.revealedCards, [cardId]: true },
    hasWon,
    movesLeft: newMovesLeft,
    isGameOver,
    lastOpenedCard: lastOpenedCard,
    // if the user was playing this level for the first time and has won, increase the passedLevels mark
    passedLevels:
      hasWon && state.currentLevel > state.passedLevels
        ? Math.min(10, state.currentLevel)
        : state.passedLevels,
    // calculate the score, only if the user has won
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
};

// reducer to replay a level
const replayLevelReducer = (state: IGameState, action: IReplayLevelAction) => {
  const { timeLimit, movesLimit } = getConstraints(
    state.currentLevel as GameLevel
  );
  restartTimer(action.payload.restart, timeLimit);

  return {
    ...state,
    cards: generateCards({
      difficulty: "EASY",
      level: state.currentLevel as GameLevel,
    }),
    revealedCards: {},
    timeLimit,
    movesLimit,
    movesLeft: movesLimit,
    hasWon: false,
    isGameOver: false,
    lastOpenedCard: "",
  };
};

const gameStateReducer = (
  state: IGameState,
  action: ReducerActionsSet
): IGameState => {
  const restart = action.payload?.restart;
  switch (action.type) {
    case ReducerActionKind.SET_CURRENT_LEVEL:
      const stateForCurrentLevel = getStateForLevel(
        state,
        action.payload.level
      );
      restartTimer(restart, stateForCurrentLevel.timeLimit);

      return stateForCurrentLevel;

    case ReducerActionKind.SET_GAME_OVER:
      return { ...state, isGameOver: true };

    case ReducerActionKind.MOVE_TO_NEXT_LEVEL:
      return state.hasWon ? onLevelWin(state, action.payload.restart) : state;

    case ReducerActionKind.REPLAY_LEVEL:
      return replayLevelReducer(state, action);

    case ReducerActionKind.MAKE_A_MOVE:
      return makeAMoveReducer(state, action);

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
  lastOpenedCard: "",
  hasWon: false,
};

const GameContext = React.createContext<IGameStateContext>({
  gameState: initialState,
});

function GameStateProvider({ ...props }) {
  // persist the passedLevels and currentScore to localStorage
  const [savedState, saveState] = useLocalStorage("GAME-STATE", {
    passedLevels: 0,
    currentScore: 0,
  });

  // Wrap reducer in order to save the latest values of passedLevels and currentScore to localStorage
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
      (savedState?.passedLevels + 1) as GameLevel
    ),
    ...savedState,
  });

  const { seconds, minutes, restart, start, pause } = useTimer({
    expiryTimestamp: new Date().setSeconds(
      new Date().getSeconds() + gameState.timeLimit
    ),
    onExpire: () => {
      // set game as over when timer has expired
      actionsDispatcher({ type: ReducerActionKind.SET_GAME_OVER });
    },
    autoStart: false,
  });

  gameState.timer = {
    seconds,
    minutes,
  };

  // action dispatcher to execute when user clicks on the card
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

  // action dispatcher to reset the game
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

  const setCurrentLevel = (level: GameLevel) => {
    actionsDispatcher({
      type: ReducerActionKind.SET_CURRENT_LEVEL,
      payload: { level, restart },
    });
  };

  const value = {
    gameState,
    actionsDispatcher,
    makeAMove,
    resetGame,
    moveToNextLevel,
    replayLevel,
    setCurrentLevel,
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
