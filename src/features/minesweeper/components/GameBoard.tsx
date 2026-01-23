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

  // 1. Hook theo dõi kích thước thật của container cha
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

  // 2. Tính toán Cell Size "Thông minh"
  const cellSize = useMemo(() => {
    if (containerWidth === 0) return 30; // Default fallback

    // Logic: Lấy chiều rộng container chia cho số cột
    const rawSize = (containerWidth - 32) / config.cols; // Trừ padding 32px (p-4)

    // Ràng buộc kích thước:
    // - Mobile: Tối thiểu 32px để dễ bấm (Touch target)
    // - Desktop: Tối đa 45px để không quá to thô
    // - Desktop Hard Mode: Có thể nhỏ xuống 20px để vừa màn hình

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const minSize = isMobile ? 30 : 22;
    const maxSize = 45;

    return Math.min(Math.max(rawSize, minSize), maxSize);
  }, [containerWidth, config.cols]);

  return (
    // Container chính giới hạn chiều rộng và chiều cao
    // w-full max-w-6xl: Giới hạn chiều ngang trên màn hình siêu lớn
    // h-[80vh]: Giới hạn chiều cao để board không chiếm hết màn hình làm mất Header
    <div
      ref={containerRef}
      className="w-full max-w-7xl flex flex-col items-center justify-start overflow-hidden px-2"
    >
      {/* Scroll Container:
          - Desktop: Gần như không scroll vì ta đã auto-fit size.
          - Mobile: Scroll DỌC (overflow-y-auto) vì ta đã chuyển sang layout dọc.
       */}
      <div
        className="relative bg-gray-800 p-2 rounded-lg shadow-2xl border-4 border-gray-600 overflow-y-auto overflow-x-hidden custom-scrollbar"
        style={{
          maxHeight: "75vh", // Cho phép cuộn dọc nếu board quá dài (Mobile)
        }}
      >
        <div
          className="grid gap-[1px] bg-gray-700"
          style={{
            // CSS Grid thần thánh: Định nghĩa số cột cứng
            gridTemplateColumns: `repeat(${config.cols}, ${cellSize}px)`,
            // Width fit-content để grid ôm sát các ô
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
                cellSize={`${cellSize}px`} // Truyền px chính xác vào
                onClick={onCellClick}
                onRightClick={onRightClick}
              />
            )),
          )}
        </div>
      </div>

      {/* Hint UI */}
      <div className="mt-2 text-white/30 text-xs italic">
        {config.rows > 20 ? "💡 Cuộn dọc để xem thêm bản đồ" : " "}
      </div>
    </div>
  );
};
