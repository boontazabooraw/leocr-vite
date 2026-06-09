import { useTheme } from "../hooks/useTheme";
import Dark from "../assets/moon.svg?react";
import Light from "../assets/sun.svg?react";

export default function Topnav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between p-4 fixed top-0 w-full">
      <h1 className="text-center font-semibold font-inter text-2xl">LeOCR</h1>
      <button
        className="text-(--text) hover:opacity-80 transition-all duration-300 "
        onClick={toggleTheme}
      >
        {theme === "light" ? (
          <Light className="w-8 h-8" />
        ) : (
          <Dark className="w-8 h-8" />
        )}
      </button>
    </div>
  );
}
