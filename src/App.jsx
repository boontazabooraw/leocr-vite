import Footer from "./components/Footer";
import Main from "./components/Main";
import Topnav from "./components/Topnav";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme } = useTheme();

  return (
    <div
      className={`${theme === "dark" ? "dark" : ""} bg-(--bg) text-(--text) transition-colors duration-200 relative`}
    >
      <Topnav />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
