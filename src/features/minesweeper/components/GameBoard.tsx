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
    <div
      ref={containerRef}
      className="w-full max-w-7xl flex flex-col items-center justify-start overflow-hidden px-2"
    >
      {/* Container Kính mờ siêu đẹp */}
      <div
        className="relative bg-white/10 backdrop-blur-xl p-4 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.2)] border border-white/20 overflow-y-auto overflow-x-hidden custom-scrollbar"
        style={{ maxHeight: "75vh" }}
      >
        <div
          className="flex flex-wrap justify-center content-start" // Dùng flex wrap hoặc grid đều được, nhưng grid chuẩn hơn
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${config.cols}, ${cellSize}px)`,
            width: "fit-content",
            // Bỏ gap ở grid cha vì ta đã margin ở Cell con để tạo rãnh đẹp hơn
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

      {/* Hint UI Cute */}
      <div className="mt-4 flex items-center gap-2 text-white/60 text-sm font-medium px-4 py-2 bg-black/20 rounded-full backdrop-blur-md">
        {config.rows > 20
          ? "👆 Vuốt dọc để tìm kho báu nha"
          : "✨ Chúc bạn may mắn!"}
      </div>
    </div>
  );
};
