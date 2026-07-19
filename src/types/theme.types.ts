/** Available background theme identifiers — must match BE ThemeId enum */
export enum ThemeId {
  COASTAL = 'COASTAL',
  RICEFIELD = 'RICEFIELD',
  CYBERPUNK = 'CYBERPUNK',
  SUNSET = 'SUNSET',
  SNOWY = 'SNOWY',
}

/** Metadata for displaying a selectable theme in the UI */
export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  isFree: boolean;
}
