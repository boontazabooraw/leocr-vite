import { useTheme } from "../hooks/useTheme";

export default function Topnav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between p-2 fixed top-0 w-full border">
      <h1>&nbsp;</h1>
      <button className="text-3xl" onClick={toggleTheme}>{theme === "light" ? "🌚" : "🌞"}</button>
    </div>
  );
}
