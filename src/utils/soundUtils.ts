export const playSound = (
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine'
): void => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = type;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (error) {
    console.warn('Audio not supported:', error);
  }
};

export const SOUNDS = {
  REVEAL: { frequency: 400, duration: 0.1, type: 'sine' as OscillatorType },
  FLAG: { frequency: 700, duration: 0.08, type: 'sine' as OscillatorType },
  UNFLAG: { frequency: 500, duration: 0.08, type: 'sine' as OscillatorType },
  EXPLOSION: { frequency: 100, duration: 0.5, type: 'sawtooth' as OscillatorType },
  WIN: { frequency: 800, duration: 0.3, type: 'sine' as OscillatorType }
};