import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("theme") || "light",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
    document.body.className = theme === "dark" ? "bg-dark text-white" : "bg-white text-dark";
  },
}));