import React, { useMemo } from "react";
import { Flag, Bomb } from "lucide-react";
import { Cell as CellType } from "../types/index";

// Neon glow colors for numbers
const NUMBER_COLORS = [
  "",
  "text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]",       // 1
  "text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.5)]",   // 2
  "text-rose-400 drop-shadow-[0_0_6px_rgba(251,113,133,0.5)]",     // 3
  "text-indigo-400 drop-shadow-[0_0_6px_rgba(129,140,248,0.5)]",   // 4
  "text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]",     // 5
  "text-teal-400 drop-shadow-[0_0_6px_rgba(45,212,191,0.5)]",      // 6
  "text-fuchsia-400 drop-shadow-[0_0_6px_rgba(232,121,249,0.5)]",   // 7
  "text-slate-400",                                                // 8
];

interface CellProps {
  cell: CellType;
  row: number;
  col: number;
  explosionCell: { row: number; col: number } | null;
  cellSize: string;
  onClick: (row: number, col: number) => void;
  onRightClick: (e: React.MouseEvent, row: number, col: number) => void;
}

export const Cell: React.FC<CellProps> = ({
  cell,
  row,
  col,
  explosionCell,
  cellSize,
  onClick,
  onRightClick,
}) => {
  const isExplosion = explosionCell?.row === row && explosionCell?.col === col;

  const content = useMemo(() => {
    // 1. Flagged State (Glowing neon flag)
    if (cell.state === "flagged") {
      return (
        <Flag 
          className="w-[50%] h-[50%] text-pink-500 fill-pink-500/20 filter drop-shadow-[0_0_4px_rgba(244,63,94,0.6)] animate-bounce-short" 
        />
      );
    }
    
    // 2. Hidden State
    if (cell.state === "hidden") return null;

    // 3. Revealed Bomb
    if (cell.isMine) {
      return (
        <div className={`relative flex items-center justify-center w-full h-full ${isExplosion ? "animate-shake" : ""}`}>
          {isExplosion ? (
            <span className="text-[110%] animate-ping absolute">💥</span>
          ) : (
            <Bomb className="w-[55%] h-[55%] text-rose-500 fill-rose-500/10 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
          )}
          {isExplosion && <span className="text-[110%] z-10">💥</span>}
        </div>
      );
    }

    // 4. Neighbor Mine Count
    if (cell.neighborMines > 0) {
      return (
        <span
          className={`font-black font-mono select-none ${NUMBER_COLORS[cell.neighborMines]}`}
          style={{ fontSize: `calc(${cellSize} * 0.55)` }}
        >
          {cell.neighborMines}
        </span>
      );
    }
    
    return null;
  }, [cell, isExplosion, cellSize]);

  const cellClass = useMemo(() => {
    const base =
      "relative flex items-center justify-center cursor-pointer transition-all duration-200 select-none rounded-lg mx-[2px] my-[2px] overflow-hidden";

    // Revealed Cell
    if (cell.state === "revealed") {
      if (cell.isMine) {
        return `${base} bg-rose-950/40 border border-rose-500/50 ${
          isExplosion ? "scale-105 z-10 shadow-neon-pink bg-rose-900/60" : ""
        }`;
      }
      return `${base} bg-slate-950/70 border border-slate-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]`;
    }

    // Hidden Cell (Sleek Glass Terminal Grid Block)
    return `${base} bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 hover:shadow-[0_0_8px_rgba(56,189,248,0.2)] active:scale-90`;
  }, [cell.state, cell.isMine, isExplosion]);

  return (
    <div
      className={cellClass}
      style={{ width: cellSize, height: cellSize }}
      onClick={() => onClick(row, col)}
      onContextMenu={(e) => onRightClick(e, row, col)}
    >
      {content}
    </div>
  );
};
export default Cell;