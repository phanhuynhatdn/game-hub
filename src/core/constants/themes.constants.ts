import { ThemeId } from '../../types/theme.types';
import type { Theme } from '../../types/theme.types';

/** All available themes with display metadata */
export const AVAILABLE_THEMES: Theme[] = [
  {
    id: ThemeId.COASTAL,
    name: 'Coastal Theme 🏖️',
    description: 'Free & Default starry sky',
    isFree: true,
  },
  {
    id: ThemeId.RICEFIELD,
    name: 'Ricefield Theme 🌾',
    description: 'Golden & green emerald field (Premium)',
    isFree: false,
  },
  {
    id: ThemeId.CYBERPUNK,
    name: 'Cyberpunk Theme 🌆',
    description: 'Neon magenta and cyan retro grid (Premium)',
    isFree: false,
  },
  {
    id: ThemeId.SUNSET,
    name: 'Sunset Theme 🌅',
    description: 'Warm orange and purple horizon (Premium)',
    isFree: false,
  },
  {
    id: ThemeId.SNOWY,
    name: 'Snowy Theme ❄️',
    description: 'Chilly white and sky blue winter (Premium)',
    isFree: false,
  },
];
