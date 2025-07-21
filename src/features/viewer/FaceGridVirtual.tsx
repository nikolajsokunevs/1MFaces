import React, { useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { AvatarCell } from "../../components/AvatarCell";
import type { FaceCell } from "../../models/FaceCell";
import { mockFaces } from "./mockFaces";

const GRID_WIDTH = 1000;
const GRID_HEIGHT = 1000;
const MAX_IMAGE_SIZE = 100; // px
const MAX_VISIBLE_CELLS = 1000;

function getWrappedIndex(x: number, y: number): number {
  const wrappedX = ((x % GRID_WIDTH) + GRID_WIDTH) % GRID_WIDTH;
  const wrappedY = ((y % GRID_HEIGHT) + GRID_HEIGHT) % GRID_HEIGHT;
  return wrappedY * GRID_WIDTH + wrappedX;
}

function getCellAt(x: number, y: number): FaceCell {
  const index = getWrappedIndex(x, y);
  return mockFaces[index];
}

function getMinScale(): number {
  const viewportArea = window.innerWidth * window.innerHeight;
  const minImageSize = Math.sqrt(viewportArea / MAX_VISIBLE_CELLS);
  return minImageSize / MAX_IMAGE_SIZE;
}

function getImageSizeByZoom(zoom: number): number {
  const size = zoom * MAX_IMAGE_SIZE;
  return Math.max(5, Math.min(size, MAX_IMAGE_SIZE));
}

export const FaceGridVirtual: React.FC = () => {
  const [selected, setSelected] = useState<FaceCell | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const imageSize = getImageSizeByZoom(zoom);
  const gap = 2;
  const cellTotalSize = imageSize + gap;

  const cols = Math.ceil(window.innerWidth / cellTotalSize) + 2;
  const rows = Math.ceil(window.innerHeight / cellTotalSize) + 2;

  const centerX = Math.floor(-position.x / cellTotalSize);
  const centerY = Math.floor(-position.y / cellTotalSize);

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden">
      <TransformWrapper
        ref={transformRef}
        minScale={getMinScale()}
        maxScale={1}
        limitToBounds={false}
        onPanningStop={({ state }) => {
          setPosition({ x: state.positionX, y: state.positionY });
        }}
        onZoomStop={({ state }) => {
          setZoom(state.scale);
        }}
        wheel={{ step: 50 }}
      >
        <TransformComponent>
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${imageSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${imageSize}px)`,
              gap: `${gap}px`,
            }}
          >
            {Array.from({ length: rows }, (_, rowIdx) =>
              Array.from({ length: cols }, (_, colIdx) => {
                const x = centerX + colIdx - Math.floor(cols / 2);
                const y = centerY + rowIdx - Math.floor(rows / 2);
                const cell = getCellAt(x, y);
                return (
                  <AvatarCell
                    key={`${x},${y}`}
                    data={cell}
                    onClick={setSelected}
                    imageSize={imageSize}
                  />
                );
              })
            )}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white text-black p-6 rounded-xl w-80 relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.imageUrl + "/900"}
              alt=""
              className="w-700 h-700 rounded-30 mx-auto mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold text-center">
              {selected.name || "Аноним"}
            </h2>
            <p className="text-center text-gray-500">
              {selected.country || "Без страны"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};