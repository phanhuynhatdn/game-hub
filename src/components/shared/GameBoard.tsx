import React from "react";
import { Cell } from "./Cell";
import { Cell as CellType, GameConfig } from "../../types/minesweeper.types";

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
  // Senior Logic: Ép kích thước ô tối thiểu trên mobile để không bị squish
  const minCellSize =
    "min-w-[30px] min-h-[30px] sm:min-w-[35px] sm:min-h-[35px]";

  return (
    <div className="w-full flex justify-center mb-6">
      {/* Container bọc ngoài cho phép scroll ngang trên mobile */}
      <div className="w-full overflow-auto pb-4 scrollbar-thin scrollbar-thumb-white/20">
        <div
          className="inline-block mx-auto bg-gray-800 p-2 rounded-xl shadow-2xl border-4 border-white/5"
          style={{
            // Đảm bảo grid luôn giữ đúng số cột
            display: "grid",
            gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
            width: "max-content", // Quan trọng: Grid không được co lại nhỏ hơn nội dung
            minWidth: "100%",
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
                cellSize={minCellSize} // Sử dụng min-size thay vì dynamic size
                onClick={onCellClick}
                onRightClick={onRightClick}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
};
