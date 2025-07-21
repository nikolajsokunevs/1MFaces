import React, { useState, useRef } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { AvatarCell } from "../../components/AvatarCell";
import type { FaceCell } from "../../models/FaceCell";
import { mockFaces } from "./mockFaces";
import { FaceModal } from "../../components/FaceModal";

const GRID_SIZE = 100;
const mockCells = mockFaces;

function getImageSizeByZoom(zoom: number): number {
    console.log("zoome size:")
  console.log(zoom)
  if (zoom < 1) return 20;
  if (zoom < 2) return 40;
  return 100;
}

export const FaceGrid: React.FC = () => {
  const [selected, setSelected] = useState<FaceCell | null>(null);
  const [zoom, setZoom] = useState(1);

  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const imageSize = getImageSizeByZoom(zoom);

  return (
    <div className="w-full h-screen bg-black text-white">
      <TransformWrapper
        ref={transformRef}
        onZoomStop={({ state }) => {
          setZoom(state.scale);
        }}
      >
        <TransformComponent>
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
              gap: "2px",
            }}
          >
            {mockCells.map((cell) => (
              <AvatarCell
                key={cell.id}
                data={cell}
                onClick={setSelected}
                imageSize={imageSize}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {selected && <FaceModal data={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};