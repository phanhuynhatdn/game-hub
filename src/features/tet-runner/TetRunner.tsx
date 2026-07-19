import React, { useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useTetRunner } from "./hooks/useTetRunner";
import { fetchWithAuth } from "../../core/services/api";
import { CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT } from "./utils/constants";
import { TetRunnerState } from "./types";
import { IdleOverlay } from "./components/IdleOverlay";
import { CountdownOverlay } from "./components/CountdownOverlay";
import { GameOverOverlay } from "./components/GameOverOverlay";

interface TetRunnerProps {
  onBack: () => void;
}

const TetRunner: React.FC<TetRunnerProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const questions = useMemo(() => {
    return (t("tetRunner.questions", { returnObjects: true }) as string[]) || [];
  }, [t]);

  const {
    state,
    score,
    countdown,
    playerY,
    obstacles,
    startCountdown,
    jump,
    update,
  } = useTetRunner(questions);

  // Submit high score to backend upon game over
  useEffect(() => {
    if (state === TetRunnerState.GAMEOVER && score > 0) {
      if (localStorage.getItem('token')) {
        fetchWithAuth('/scores', {
          method: 'POST',
          body: JSON.stringify({
            gameId: 'tet-runner',
            score: score,
            timeInSec: 30, // Mock duration
          }),
        }).catch((err) => console.error('Failed to submit score:', err));
      }
    }
  }, [state, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;

    const render = () => {
      update(ctx);

      // Deep Cyber Arcade Background
      ctx.fillStyle = "#070519";
      ctx.fillRect(0, 0, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT);

      // Matrix Cyber Grid lines
      ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_BASE_WIDTH; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_BASE_HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i < CANVAS_BASE_HEIGHT; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_BASE_WIDTH, i);
        ctx.stroke();
      }

      // Draw Player Character with Glowing Neon Trail Ring
      ctx.save();
      const characterY = playerY.current + 20; // center point
      
      // Outer glow circle
      const gradient = ctx.createRadialGradient(85, characterY + 20, 5, 85, characterY + 20, 35);
      gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
      gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(85, characterY + 20, 35, 0, Math.PI * 2);
      ctx.fill();

      // Draw Character Emoji
      ctx.font = "45px Outfit, sans-serif";
      ctx.fillText("🧹", 60, playerY.current + 45);
      ctx.restore();

      // Draw Cyber Neon Obstacles
      obstacles.current.forEach((obs) => {
        ctx.save();
        
        // Translucent background
        ctx.fillStyle = "rgba(244, 63, 94, 0.12)";
        // Glowing outline border
        ctx.strokeStyle = "#f43f5e";
        ctx.lineWidth = 3;
        
        // Shadow glow
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = 10;

        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(obs.x, obs.y, obs.width, 45, 12);
        } else {
          ctx.rect(obs.x, obs.y, obs.width, 45);
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow for stroke to avoid heavy blur
        ctx.stroke();

        // Obstacle text
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = 4;
        ctx.font = "bold 15px Outfit, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(obs.text, obs.x + obs.width / 2, obs.y + 28);
        
        ctx.restore();
      });

      if (state === TetRunnerState.PLAYING) {
        animId = requestAnimationFrame(render);
      }
    };

    if (state === TetRunnerState.PLAYING) {
      animId = requestAnimationFrame(render);
    } else {
      ctx.fillStyle = "#070519";
      ctx.fillRect(0, 0, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT);
    }

    return () => cancelAnimationFrame(animId);
  }, [state, update, playerY, obstacles]);

  const handleInteraction = (e: React.SyntheticEvent) => {
    jump();
  };

  return (
    <div
      className="min-h-screen bg-[#030014] flex flex-col items-center justify-center p-4 touch-none select-none overflow-hidden relative"
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none z-0"></div>

      {/* Main Game Interface Container */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="relative w-full aspect-[16/10] bg-slate-950/45 border border-slate-900 shadow-glass rounded-3xl overflow-hidden backdrop-blur-xl">
          <canvas
            ref={canvasRef}
            width={CANVAS_BASE_WIDTH}
            height={CANVAS_BASE_HEIGHT}
            className="w-full h-full object-contain block"
          />

          {/* Floating Back Button during Active Play */}
          {state === TetRunnerState.PLAYING && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onBack();
              }}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <Home size={18} />
            </motion.button>
          )}

          {/* Phase Overlays */}
          {state === TetRunnerState.IDLE && (
            <IdleOverlay onStart={startCountdown} onBack={onBack} />
          )}

          {state === TetRunnerState.COUNTDOWN && (
            <CountdownOverlay countdown={countdown} />
          )}

          {state === TetRunnerState.GAMEOVER && (
            <GameOverOverlay score={score} onRetry={startCountdown} onBack={onBack} />
          )}

          {/* Real-time score indicator */}
          {state === TetRunnerState.PLAYING && (
            <div className="absolute top-6 left-6 text-5xl font-black text-white bg-slate-900/60 border border-white/10 px-6 py-2 rounded-2xl select-none text-glow-blue backdrop-blur-md">
              {score}
            </div>
          )}
        </div>
      </div>

      {/* Hints panel */}
      <div className="mt-8 px-6 py-2.5 rounded-full bg-slate-900/40 border border-slate-800/80 backdrop-blur-md text-center max-w-xs relative z-10 shadow-sm">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">
          {t("tetRunner.hint")}
        </p>
      </div>

      {/* Banner Ad Slot Placeholder */}
      <div className="mt-8 w-full max-w-4xl mx-auto h-[90px] bg-slate-950/20 border border-white/5 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-[10px] text-slate-600 font-bold tracking-[0.2em] uppercase select-none relative z-10">
        <span>Advertisement Slot</span>
        <span className="text-[8px] text-slate-700 font-medium mt-1">728x90 Leaderboard Banner</span>
      </div>
    </div>
  );
};

export default TetRunner;