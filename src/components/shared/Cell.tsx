import React, { useMemo } from 'react';
import { Flag, Bomb } from 'lucide-react';
import { Cell as CellType } from '../../types/minesweeper.types';
import { CELL_COLORS } from '../../types/minesweeperConfig';
import { SpecialFlag } from '../minesweeper/SpecialFlag';


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
  onRightClick
}) => {
  const isExplosion = explosionCell?.row === row && explosionCell?.col === col;

  const content = useMemo(() => {
    if (cell.state === 'flagged') {
      return <SpecialFlag />; 
    }
    if (cell.state === 'hidden') return null;
    if (cell.isMine) {
      return (
        <Bomb
          className={`w-3 h-3 sm:w-5 sm:h-5 text-red-600 ${isExplosion ? 'animate-ping' : ''}`}
        />
      );
    }
    if (cell.neighborMines > 0) {
      return (
        <span className={`font-bold text-xs sm:text-base ${CELL_COLORS[cell.neighborMines]}`}>
          {cell.neighborMines}
        </span>
      );
    }
    return null;
  }, [cell, isExplosion]);

  const cellClass = useMemo(() => {
    const base =
      'flex items-center justify-center cursor-pointer transition-all duration-200 border';
    if (cell.state === 'revealed') {
      if (cell.isMine) {
        return `${base} bg-red-500 ${isExplosion ? 'scale-110' : ''} border-red-600`;
      }
      return `${base} bg-gray-200 border-gray-300`;
    }
    return `${base} bg-gradient-to-br from-gray-300 to-gray-400 hover:from-gray-400 hover:to-gray-500 shadow-md hover:shadow-lg active:shadow-inner border-gray-500`;
  }, [cell.state, cell.isMine, isExplosion]);

  return (
    <div
      className={`${cellSize} ${cellClass}`}
      onClick={() => onClick(row, col)}
      onContextMenu={e => onRightClick(e, row, col)}
    >
      {content}
    </div>
  );
};