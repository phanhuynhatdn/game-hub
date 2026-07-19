import React, { useEffect, useRef, useState, useMemo } from "react";
import { Cell } from "./Cell";
import { Cell as CellType, GameConfig } from "../types/index";

interface GameBoardProps {
  board: CellType[][];
  config: GameConfig;
  explosionCell: { row: number; col: number } | null;
  onCellClick: (row: number, col: number) => void;
  onRightClick: (e: React.MouseEvent, row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  config,
  explosionCell,
  onCellClick,
  onRightClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Track parent width for responsiveness
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute responsive cell size
  const cellSize = useMemo(() => {
    if (containerWidth === 0) return 30; // Default fallback

    const rawSize = (containerWidth - 32) / config.cols;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const minSize = isMobile ? 30 : 22;
    const maxSize = 45;

    return Math.min(Math.max(rawSize, minSize), maxSize);
  }, [containerWidth, config.cols]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl flex flex-col items-center justify-start overflow-hidden px-2 mx-auto"
    >
      {/* High-fidelity glass terminal grid panel */}
      <div
        className="relative bg-slate-900/30 backdrop-blur-xl p-4 rounded-3xl border border-slate-800/80 shadow-glass overflow-y-auto overflow-x-hidden scrollbar-hide"
        style={{ maxHeight: "75vh" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${config.cols}, ${cellSize}px)`,
            width: "fit-content",
          }}
        >
          {board.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <Cell
                key={`${rowIdx}-${colIdx}`}
                cell={cell}
                row={rowIdx}
                col={colIdx}
                explosionCell={explosionCell}
                cellSize={`${cellSize}px`}
                onClick={onCellClick}
                onRightClick={onRightClick}
              />
            )),
          )}
        </div>
      </div>

      {/* Modern Status Hint */}
      <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider px-4 py-2 bg-slate-900/50 rounded-full border border-slate-800/50 backdrop-blur-md">
        {config.rows > 20
          ? "👆 Scroll vertically to navigate grid"
          : "✨ Avoid the mines to win!"}
      </div>
    </div>
  );
};
export default GameBoard;
