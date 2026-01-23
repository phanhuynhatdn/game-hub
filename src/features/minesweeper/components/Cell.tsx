import React, { useMemo } from "react";
import { Flag, Bomb } from "lucide-react";
import { Cell as CellType } from "../types/index";
import { CELL_COLORS } from "../config/index";
import { SpecialFlag } from "./SpecialFlag";

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
    if (cell.state === "flagged") {
      return <SpecialFlag />;
    }
    if (cell.state === "hidden") return null;
    if (cell.isMine) {
      return (
        <Bomb
          className={`w-3 h-3 sm:w-5 sm:h-5 text-red-600 ${isExplosion ? "animate-ping" : ""}`}
        />
      );
    }
    if (cell.neighborMines > 0) {
      return (
        <span
          className={`font-bold text-xs sm:text-base ${CELL_COLORS[cell.neighborMines]}`}
        >
          {cell.neighborMines}
        </span>
      );
    }
    return null;
  }, [cell, isExplosion]);

  const cellClass = useMemo(() => {
    // Loại bỏ các class w-x h-x cố định
    const base =
      "flex items-center justify-center cursor-pointer transition-all duration-100 border aspect-square";

    if (cell.state === "revealed") {
      if (cell.isMine) {
        return `${base} bg-red-500 ${isExplosion ? "scale-110" : ""} border-red-600`;
      }
      return `${base} bg-gray-200 border-gray-300 shadow-inner`;
    }

    return `${base} bg-gradient-to-br from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 shadow-[1px_1px_0px_rgba(255,255,255,0.4)_inset,-1px_-1px_0px_rgba(0,0,0,0.2)_inset] border-gray-500`;
  }, [cell.state, cell.isMine, isExplosion]);

  return (
    <div
      className={cellClass}
      style={{ width: cellSize, height: cellSize }} // Ép kích thước theo tính toán từ GameBoard
      onClick={() => onClick(row, col)}
      onContextMenu={(e) => onRightClick(e, row, col)}
    >
      {content}
    </div>
  );
};
