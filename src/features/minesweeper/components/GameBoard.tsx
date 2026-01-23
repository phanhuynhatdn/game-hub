import React, { useMemo } from "react";
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
  /**
   * Senior Logic: Tính toán Cell Size động hoàn toàn
   * - 90vw: Để lại 10% lề hai bên cho mobile.
   * - 70vh: Giới hạn chiều cao để không phải scroll dọc quá nhiều.
   */
  const cellSize = useMemo(() => {
    // Tính toán kích thước ô dựa trên số cột để ép nó vừa khít chiều rộng màn hình (ưu tiên không scroll ngang)
    // Đối với Expert (30 cột), 90vw / 30 = ~12px (Quá nhỏ).
    // Vì vậy ta áp dụng ngưỡng tối thiểu để đảm bảo UX.
    const calculatedWidth = 90 / config.cols;

    return {
      // mobileSize: Nếu bảng rộng, cho phép nhỏ xuống 20px (ngưỡng tối thiểu nhìn thấy số)
      // desktopSize: Không bao giờ to quá 45px để tránh thô.
      width: `clamp(20px, ${calculatedWidth}vw, 45px)`,
    };
  }, [config.cols]);

  return (
    <div className="w-full flex flex-col items-center mb-6 overflow-hidden">
      {/* Scroll Container: Chỉ xuất hiện khi bảng thực sự vượt quá khả năng hiển thị tối thiểu (Expert trên Mobile) */}
      <div className="w-full overflow-x-auto scrollbar-hide flex justify-start md:justify-center p-4">
        <div
          className="inline-grid bg-gray-800 p-1 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.5)] border-2 border-gray-600 select-none"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, ${cellSize.width})`,
            // Ép Grid luôn giữ tỉ lệ vuông và không bị méo bởi Flexbox
            width: "max-content",
            minWidth: "min-content",
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
                // Truyền kích thước tính toán được vào Cell
                cellSize={cellSize.width}
                onClick={onCellClick}
                onRightClick={onRightClick}
              />
            )),
          )}
        </div>
      </div>

      {/* Chỉ dẫn cho người dùng Mobile nếu bảng quá lớn */}
      {config.cols > 15 && (
        <div className="md:hidden text-white/40 text-[10px] animate-pulse">
          ↔️ Vuốt ngang để xem hết bản đồ
        </div>
      )}
    </div>
  );
};
