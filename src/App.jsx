import Main from "./components/Main";
import Topnav from "./components/Topnav";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} min-h-screen bg-(--bg) text-(--text) transition-colors duration-200`}
    >
      <Topnav />
      <Main />
    </div>
  );
}

export default App;
