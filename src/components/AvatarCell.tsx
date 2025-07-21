import React, { useRef } from "react";
import type { FaceCell } from "../models/FaceCell";
import defaultAvatar from '../assets/faces/no_user_photo.png';

interface AvatarCellProps {
  data: FaceCell;
  onClick?: (data: FaceCell) => void;
  imageSize?: number;
}

export const AvatarCell: React.FC<AvatarCellProps> = ({
  data,
  onClick,
  imageSize = 40,
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
      onClick?.(data);
    }
  };

    const imageUrl = hasData
    ? `${data.imageUrl}/${imageSize}`
    : defaultAvatar;
     const title = hasData ? data.name : 'Default avatar';

    return (
      <div
        className="group relative w-[20px] h-[20px] overflow-visible cursor-pointer hover:z-10"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        title={title}
      >
        <div className="rounded overflow-hidden transform transition-transform duration-200 ease-out hover:scale-125 ring-0 group-hover:ring-yellow-400 border border-gray-600">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );

};
