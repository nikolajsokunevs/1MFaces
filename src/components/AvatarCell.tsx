import React, { useRef } from "react";
import type { FaceCell } from "../models/FaceCell";
import defaultAvatar from "../assets/faces/no_user_photo.png";

interface AvatarCellProps {
  data?: FaceCell | null;
  onClick?: (data: FaceCell) => void;
  imageSize?: number;
  x: number;
  y: number;
}

export const AvatarCell: React.FC<AvatarCellProps> = ({
  data,
  onClick,
  imageSize = 40,
  x = 0,
  y = 0,
}) => {
  const hasData = !!data;
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    const down = mouseDownPos.current;
    if (!down) return;

    const dx = Math.abs(e.clientX - down.x);
    const dy = Math.abs(e.clientY - down.y);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
        console.log("CLICKED", data);
        onClick?.(data ?? null);
    }
  };



  const imageUrl = hasData ? `${data.imageUrl}/${imageSize}` : defaultAvatar;
  const title = `${x},${y}`;

  return (
    <>
      <div
        className="group relative w-full h-full overflow-visible cursor-pointer hover:z-10 p-[2px]"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        title={title}
      >
        <div className="rounded overflow-hidden transform transition-all duration-200 ease-out hover:scale-125 border border-gray-900 group-hover:ring-2 group-hover:ring-yellow-400 w-full h-full">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      </div>
    </>
  );
};