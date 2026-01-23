import React, { useEffect, useRef, useMemo } from "react";
import { Home, RotateCcw, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTetRunner } from "./hooks/useTetRunner";
import { CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT } from "./utils/constants";

interface TetRunnerProps {
  onBack: () => void;
}

const TetRunner: React.FC<TetRunnerProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // SENIOR: Lấy data từ i18n và memoize để tránh re-render không cần thiết truyền vào hook
  const questions = useMemo(() => {
    return (t("tetRunner.questions", { returnObjects: true }) as string[]) || [];
  }, [t]);

  // Dependency Injection: Truyền câu hỏi vào hook
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize alpha false nếu không cần trong suốt nền
    if (!ctx) return;

    let animId: number;

    const render = () => {
      // 1. Update Physics Logic
      update(ctx);

      // 2. Draw Background
      const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_BASE_HEIGHT);
      grad.addColorStop(0, "#991b1b");
      grad.addColorStop(1, "#450a0a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT);

      // 3. Draw Character (Cái chổi 🧹)
      // Save/Restore context để đảm bảo shadow/font không bị leak sang object khác
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(254, 240, 138, 0.4)";
      ctx.font = "45px Arial";
      ctx.fillText("🧹", 50, playerY.current + 40);
      ctx.restore();

      // 4. Draw Obstacles (Câu hỏi)
      obstacles.current.forEach((obs) => {
        ctx.save();
        
        // Vẽ Box
        ctx.fillStyle = "#fef08a";
        ctx.strokeStyle = "#eab308";
        ctx.lineWidth = 3;
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(obs.x, obs.y, obs.width, 45, 12);
        } else {
            ctx.rect(obs.x, obs.y, obs.width, 45);
        }
        ctx.fill();
        ctx.stroke();

        // Vẽ Text
        ctx.fillStyle = "#1e1b4b";
        ctx.font = "bold 16px Arial"; // Font khớp với lúc đo (measureText) trong hook
        ctx.fillText(obs.text, obs.x + 15, obs.y + 28);
        
        ctx.restore();
      });

      if (state === "PLAYING") {
        animId = requestAnimationFrame(render);
      }
    };

    if (state === "PLAYING") {
      animId = requestAnimationFrame(render);
    } else {
      // Vẽ frame tĩnh để tránh màn hình đen khi pause/idle
      ctx.fillStyle = "#7f1d1d";
      ctx.fillRect(0, 0, CANVAS_BASE_WIDTH, CANVAS_BASE_HEIGHT);
    }

    return () => cancelAnimationFrame(animId);
  }, [state, update, playerY, obstacles]); // Dependencies chuẩn

  // Hàm xử lý tương tác chung cho Mouse/Touch
  const handleInteraction = (e: React.SyntheticEvent) => {
    // Ngăn chặn sự kiện lan truyền hoặc mặc định (zoom/scroll)
    // e.preventDefault(); // Chỉ bật nếu cần thiết để tránh warning passive listener
    jump();
  };

  return (
    <div
      className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 md:p-4 touch-none select-none overflow-hidden"
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <div className="relative w-full max-w-4xl aspect-[16/10] bg-black rounded-3xl overflow-hidden border-4 border-yellow-600 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={CANVAS_BASE_WIDTH}
          height={CANVAS_BASE_HEIGHT}
          className="w-full h-full object-contain block"
        />

        {/* --- UI OVERLAYS --- */}
        
        {/* IDLE SCREEN */}
        {state === "IDLE" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md p-6 text-center z-20">
            <div className="text-8xl mb-6 animate-bounce">🧹</div>
            <h1 className="text-4xl md:text-6xl font-black text-yellow-400 mb-4 drop-shadow-lg uppercase">
              {t("tetRunner.title")}
            </h1>
            <p className="text-white/70 mb-8 max-w-md italic">
              {t("home.tetRunnerDesc")}
            </p>
            
            <div className="flex gap-4">
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    startCountdown();
                }}
                className="px-10 py-4 bg-yellow-500 hover:bg-yellow-400 text-red-950 rounded-full font-black text-2xl transition-transform hover:scale-105 shadow-xl active:scale-95"
                >
                {t("tetRunner.btnPlay")}
                </button>
                
                {/* Nút Back về Home */}
                <button
                    onClick={(e) => { e.stopPropagation(); onBack(); }}
                    className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors border border-white/20"
                >
                    <Home size={32}/>
                </button>
            </div>
          </div>
        )}

        {/* COUNTDOWN */}
        {state === "COUNTDOWN" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-30 pointer-events-none">
            <span className="text-[150px] font-black text-yellow-400 animate-ping">
              {countdown}
            </span>
          </div>
        )}

        {/* GAMEOVER SCREEN */}
        {state === "GAMEOVER" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/95 backdrop-blur-xl p-6 animate-fade-in text-white z-40">
            <div className="text-7xl mb-4 animate-pulse">😵‍💫</div>
            <h2 className="text-3xl md:text-5xl font-black mb-2 text-yellow-400 text-center">
              {t("tetRunner.gameOverTitle")}
            </h2>
            <p className="text-yellow-100/70 mb-8 text-center italic text-lg max-w-sm">
              "{t("tetRunner.gameOverSub")}"
            </p>
            
            <div className="bg-black/40 px-10 py-4 rounded-2xl mb-8 border border-white/10">
              <span className="text-5xl font-black text-yellow-300">{score}</span>
            </div>
            
            <div className="flex gap-4" onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => { e.stopPropagation(); startCountdown(); }}
                className="p-4 bg-green-600 hover:bg-green-500 rounded-2xl transition-all shadow-lg hover:scale-105"
                title={t("common.retry")}
              >
                <RotateCcw size={32} color="white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onBack(); }}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 shadow-lg"
                title={t("common.back")}
              >
                <Home size={32} />
              </button>
              <button className="flex items-center gap-2 px-6 bg-yellow-500 text-red-950 rounded-2xl font-black hover:bg-yellow-400 transition-all shadow-xl">
                <Share2 size={24} /> <span className="hidden sm:inline">{t("tetRunner.shareText")}</span>
              </button>
            </div>
          </div>
        )}

        {/* SCORE HUD */}
        {state === "PLAYING" && (
          <div className="absolute top-6 left-10 text-6xl font-black text-white/20 italic pointer-events-none select-none z-10">
            {score}
          </div>
        )}
      </div>

      <p className="mt-6 text-white/30 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
        {t("tetRunner.hint")}
      </p>
    </div>
  );
};

export default TetRunner;