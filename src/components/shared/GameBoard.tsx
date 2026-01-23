import React from 'react';
import { Cell } from './Cell';
import { Cell as CellType, GameConfig } from '../../types/minesweeper.types';

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
  onRightClick
}) => {
  const cellSize =
    config.cols > 20
      ? 'w-4 h-4 sm:w-6 sm:h-6'
      : config.cols > 15
      ? 'w-5 h-5 sm:w-8 sm:h-8'
      : 'w-8 h-8 sm:w-10 sm:h-10';

  return (
    <div className="flex justify-center mb-4 sm:mb-6 overflow-x-auto">
      <div className="inline-block bg-gray-800 p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-2xl">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))` }}
        >
          {board.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <Cell
                key={`${rowIdx}-${colIdx}`}
                cell={cell}
                row={rowIdx}
                col={colIdx}
                explosionCell={explosionCell}
                cellSize={cellSize}
                onClick={onCellClick}
                onRightClick={onRightClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};