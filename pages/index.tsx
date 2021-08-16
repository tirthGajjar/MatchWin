import GameBoard from "@/components/game-board/GameBoard";
import Main from "@/components/layout/Main";
import { GameStateProvider } from "context/GameState";

const Home = () => {
  return (
    <GameStateProvider>
      <Main>
        <GameBoard />
      </Main>
    </GameStateProvider>
  );
};

export default Home;
