import { SceneTheme } from './types';

const CHILL_POINTS_KEY = 'ambient_focus_chill_points';
const UNLOCKED_THEMES_KEY = 'ambient_focus_unlocked_themes';
const SAVED_THEME_KEY = 'ambient_focus_saved_theme';

export const getChillPoints = (): number => {
  const points = localStorage.getItem(CHILL_POINTS_KEY);
  return points ? parseInt(points, 10) : 0;
};

export const saveChillPoints = (points: number) => {
  localStorage.setItem(CHILL_POINTS_KEY, points.toString());
};

export const getUnlockedThemes = (): SceneTheme[] => {
  const themes = localStorage.getItem(UNLOCKED_THEMES_KEY);
  if (themes) {
    try {
      return JSON.parse(themes) as SceneTheme[];
    } catch (e) {
      return [SceneTheme.COASTAL];
    }
  }
  return [SceneTheme.COASTAL];
};

export const unlockTheme = (theme: SceneTheme) => {
  const themes = getUnlockedThemes();
  if (!themes.includes(theme)) {
    themes.push(theme);
    localStorage.setItem(UNLOCKED_THEMES_KEY, JSON.stringify(themes));
  }
};

export const getSavedTheme = (): SceneTheme => {
  const theme = localStorage.getItem(SAVED_THEME_KEY) as SceneTheme;
  return Object.values(SceneTheme).includes(theme) ? theme : SceneTheme.COASTAL;
};

export const saveTheme = (theme: SceneTheme) => {
  localStorage.setItem(SAVED_THEME_KEY, theme);
};
