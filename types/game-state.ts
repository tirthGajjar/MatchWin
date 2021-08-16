import { CardData, GameLevel } from "@/types/game";
import { RestartTimerAction } from "@/types/timer";
import { ReducerActionKind } from "context/GameState";
import { Dispatch } from "react";

export interface IGameState {
  currentLevel: GameLevel;
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

export interface IGameStateContext {
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

  setCurrentLevel?: (level: GameLevel) => void;
}

// An interface for our actions
export interface ReducerAction {
  type: ReducerActionKind;
  payload?: any;
}

export interface ISetLevelAction extends ReducerAction {
  type: ReducerActionKind.SET_CURRENT_LEVEL;
  payload: {
    level: GameLevel;

    restart: RestartTimerAction;
  };
}

export interface IChangeToPrevLevelAction extends ReducerAction {
  type: ReducerActionKind.CHANGE_TO_PREVIOUS_LEVEL;
  payload: {
    newStage: GameLevel;
  };
}

export interface ISetMovesLeftAction extends ReducerAction {
  type: ReducerActionKind.DECREMENT_MOVES_LEFT;
}

export interface IResetGameAction extends ReducerAction {
  type: ReducerActionKind.RESET_GAME;
}

export interface ISetGameOverAction extends ReducerAction {
  type: ReducerActionKind.SET_GAME_OVER;
}

export interface IMoveToNextLevelAction extends ReducerAction {
  type: ReducerActionKind.MOVE_TO_NEXT_LEVEL;
  payload: {
    restart: RestartTimerAction;
  };
}

export interface IReplayLevelAction extends ReducerAction {
  type: ReducerActionKind.REPLAY_LEVEL;
  payload: {
    restart: RestartTimerAction;
  };
}

export interface IMakeMoveAction extends ReducerAction {
  type: ReducerActionKind.MAKE_A_MOVE;
  payload: {
    cardId: number | string;
    uniqueId?: number | string;
    restart: RestartTimerAction;
    start?: () => void;
    pause?: () => void;
  };
}

export type ReducerActionsSet =
  | ISetGameOverAction
  | ISetLevelAction
  | IChangeToPrevLevelAction
  | ISetMovesLeftAction
  | IMoveToNextLevelAction
  | IMakeMoveAction
  | IReplayLevelAction
  | IResetGameAction;
