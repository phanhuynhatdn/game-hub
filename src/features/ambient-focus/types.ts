export enum TimeMode {
  SYNC = 'sync',
  TIMELAPSE = 'timelapse',
  PAUSE = 'pause',
}

export enum WeatherType {
  CLEAR = 'clear',
  RAIN = 'rain',
  SNOW = 'snow',
}

export enum SceneTheme {
  COASTAL = 'coastal',
  RICE_FIELD = 'rice_field',
}

export interface AmbientState {
  timeMode: TimeMode;
  weather: WeatherType;
  theme: SceneTheme;
  isFocusActive: boolean;
  focusTimeLeft: number;
  isAudioPlaying: boolean;
}
