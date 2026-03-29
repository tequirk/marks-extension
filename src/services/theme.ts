import { ThemeData, themeData } from "../data/theme";
import { ThemeOption } from "../types";

export const createThemeService = (themeData: ThemeData) => {
  const getThemeOrDefault = () => themeData.getTheme() ?? ThemeOption.Light;
  const toggleTheme = () => {
    const newTheme =
      getThemeOrDefault() === ThemeOption.Light
        ? ThemeOption.Dark
        : ThemeOption.Light;
    themeData.setTheme(newTheme);
    return newTheme;
  };

  const getTheme = () => getThemeOrDefault();
  return {
    getTheme,
    toggleTheme,
  };
};

export const themeService = createThemeService(themeData);
export type ThemeService = typeof themeService;
