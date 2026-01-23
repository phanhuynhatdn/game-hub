import React, { useMemo } from "react";
import { Flag, Bomb, Sparkles } from "lucide-react"; // Thêm Sparkles cho cute
import { Cell as CellType } from "../types/index";

// Bảng màu số hiện đại, tone pastel/neon nhẹ
const NUMBER_COLORS = [
  "",
  "text-blue-500 drop-shadow-sm",      // 1
  "text-emerald-500 drop-shadow-sm",   // 2
  "text-rose-500 drop-shadow-sm",      // 3
  "text-violet-600 drop-shadow-sm",    // 4
  "text-amber-600 drop-shadow-sm",     // 5
  "text-teal-600 drop-shadow-sm",      // 6
  "text-fuchsia-600 drop-shadow-sm",   // 7
  "text-slate-700 drop-shadow-sm",     // 8
];

interface CellProps {
  cell: CellType;
  row: number;
  col: number;
  explosionCell: { row: number; col: number } | null;
  cellSize: string; // string dạng '30px'
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

  // Tính toán nội dung render
  const content = useMemo(() => {
    // 1. Cắm cờ (Flag) - Dùng icon màu đỏ hồng cute
    if (cell.state === "flagged") {
      return <Flag className="w-[60%] h-[60%] text-rose-500 fill-rose-500 animate-bounce-short" />;
    }
    
    // 2. Chưa mở (Hidden)
    if (cell.state === "hidden") return null;

    // 3. Có mìn (Bomb)
    if (cell.isMine) {
      return (
        <div className={`relative flex items-center justify-center ${isExplosion ? "animate-shake" : ""}`}>
            {/* Nếu nổ thì hiện icon khác hoặc màu khác */}
            {isExplosion ? (
                <span className="text-[120%]">💥</span>
            ) : (
                <Bomb className="w-[70%] h-[70%] text-slate-700 fill-slate-800" />
            )}
        </div>
      );
    }

    // 4. Hiển thị số
    if (cell.neighborMines > 0) {
      return (
        <span
          className={`font-black font-mono ${NUMBER_COLORS[cell.neighborMines]}`}
          style={{ fontSize: `calc(${cellSize} * 0.7)` }} // Số to rõ ràng
        >
          {cell.neighborMines}
        </span>
      );
    }
    
    // 5. Ô trống đã mở -> Có thể hiện hạt bụi nhỏ hoặc để trống
    return null;
  }, [cell, isExplosion, cellSize]);

  // Tính toán Style (Class)
  const cellClass = useMemo(() => {
    const base =
      "relative flex items-center justify-center cursor-pointer transition-all duration-200 select-none rounded-xl mx-[1px] my-[1px]"; 
      // rounded-xl: Bo tròn mạnh tạo cảm giác viên kẹo
      // mx/my: Tạo khoảng hở nhỏ giữa các ô (grid gap giả)

    // State: Đã mở
    if (cell.state === "revealed") {
      if (cell.isMine) {
        return `${base} bg-rose-200 border-2 border-rose-300 ${isExplosion ? "scale-110 z-10 shadow-xl shadow-red-500/50" : ""}`;
      }
      // Ô thường đã mở: Màu trắng/trong suốt, chìm xuống (shadow-inner)
      return `${base} bg-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] border border-white/20`;
    }

    // State: Chưa mở (Hidden) -> Hiệu ứng nổi (3D button)
    // Gradient từ tím sang hồng hoặc xanh sang tím tùy sở thích
    return `${base} bg-gradient-to-b from-indigo-300 to-indigo-400 hover:from-indigo-200 hover:to-indigo-300 
            shadow-[0_4px_0_rgb(79,70,229)] active:shadow-none active:translate-y-[4px] 
            border-t border-white/30`;
    // active:translate-y-[4px]: Hiệu ứng nhấn phím cơ học cực đã tay
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