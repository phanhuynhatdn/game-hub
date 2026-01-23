import { useState, useRef, useCallback } from 'react';
import { playClickSound, playExplosionSound } from '../../../utils/soundUtils';
import { GRAVITY, JUMP_FORCE, SPEED, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT } from '../utils/constants';

// Nhận questions từ component truyền vào
export const useTetRunner = (questions: string[]) => {
  const [state, setState] = useState<'IDLE' | 'COUNTDOWN' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(3);
  
  const playerY = useRef(200);
  const velocity = useRef(0);
  const obstacles = useRef<any[]>([]);
  const frameId = useRef(0);

  const startCountdown = useCallback(() => {
    setState('COUNTDOWN');
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) {
          clearInterval(timer);
          setState('PLAYING');
          playerY.current = 200;
          velocity.current = 0;
          obstacles.current = [];
          setScore(0);
          return 0;
        }
        return p - 1;
      });
    }, 800);
  }, []);

  const jump = useCallback(() => {
    if (state === 'PLAYING') {
      velocity.current = JUMP_FORCE;
      playClickSound();
    }
  }, [state]);

  const update = (ctx: CanvasRenderingContext2D) => {
    if (state !== 'PLAYING') return;

    velocity.current += GRAVITY;
    playerY.current += velocity.current;

    // Chạm sàn/trần
    if (playerY.current > CANVAS_BASE_HEIGHT - 60 || playerY.current < -40) {
      setState('GAMEOVER');
      playExplosionSound();
      return;
    }

    // Sinh chướng ngại vật
    if (frameId.current % 110 === 0) { // Tăng khoảng cách 1 chút
      // Fallback nếu mảng rỗng
      const text = questions.length > 0 
        ? questions[Math.floor(Math.random() * questions.length)]
        : "???";
      
      // FIX CRITICAL BUG: Phải set font TRƯỚC khi đo độ rộng
      ctx.save();
      ctx.font = "bold 16px Arial"; 
      const textWidth = ctx.measureText(text).width;
      ctx.restore();

      obstacles.current.push({
        x: CANVAS_BASE_WIDTH,
        y: Math.random() * (CANVAS_BASE_HEIGHT - 180) + 60,
        text,
        width: textWidth + 30, // Padding 15px mỗi bên
        passed: false
      });
    }

    // Di chuyển và va chạm
    obstacles.current.forEach(obs => {
      obs.x -= SPEED;
      
      const px = 60, py = playerY.current + 10, pw = 30, ph = 30;
      // Hitbox logic
      if (px < obs.x + obs.width - 5 && px + pw > obs.x + 5 && py < obs.y + 35 && py + ph > obs.y + 5) {
        setState('GAMEOVER');
        playExplosionSound();
      }

      if (!obs.passed && obs.x + obs.width < px) {
        obs.passed = true;
        setScore(s => s + 1);
      }
    });

    obstacles.current = obstacles.current.filter(o => o.x + o.width > -50);
    frameId.current++;
  };

  return { state, score, countdown, playerY, obstacles, startCountdown, jump, update };
};