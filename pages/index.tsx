import Main from "@/components/layout/Main";
import { GameStateProvider } from "context/GameState";

const Home = () => {
  return (
    <GameStateProvider>
      <Main />
    </GameStateProvider>
  );
};

export default Home;
