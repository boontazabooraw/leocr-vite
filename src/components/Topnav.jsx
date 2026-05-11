import { useTheme } from "../hooks/useTheme";
import Dark from "../assets/dark.svg?react";
import Light from "../assets/light.svg?react";

export default function Topnav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between p-2 fixed top-0 w-full">
      <h1 className="text-2xl">LeOCR</h1>
      <button className="p-2 text-(--text)" onClick={toggleTheme}>
        {theme === "light" ? (
          <Dark className="w-8 h-8" />
        ) : (
          <Light className="w-8 h-8 " />
        )}
      </button>
    </div>
  );
}
