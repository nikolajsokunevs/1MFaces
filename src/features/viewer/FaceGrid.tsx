import React, { useMemo, useRef, useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { mockFaces } from "./mockFaces";
import { AvatarCell } from "../../components/AvatarCell";
import type { FaceCell } from "../../models/FaceCell";

const GRID_WIDTH = 1000;
const GRID_HEIGHT = 1000;

const CELL_SIZE = Math.max(window.innerWidth, window.innerHeight) / 50; 
const BASE_CELL_SIZE = CELL_SIZE;
const BUFFER = 2;

export const FaceGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ scale: 1, positionX: 0, positionY: 0 });

  const faceMap = useMemo(() => {
    const map = new Map<string, FaceCell>();
    for (const face of mockFaces) {
      map.set(`${face.x}-${face.y}`, face);
    }
    return map;
  }, []);

  const cellSize = BASE_CELL_SIZE * transform.scale;

  // Вычисляем, какие ячейки попадают в область видимости
  const visibleCells = useMemo(() => {
    const container = containerRef.current;
    if (!container) return [];

    const viewportWidth = container.clientWidth;
    const viewportHeight = container.clientHeight;

    const offsetX = -transform.positionX / transform.scale;
    const offsetY = -transform.positionY / transform.scale;

    const startCol = Math.floor(offsetX / BASE_CELL_SIZE) - BUFFER;
    const endCol = Math.ceil((offsetX + viewportWidth / transform.scale) / BASE_CELL_SIZE) + BUFFER;

    const startRow = Math.floor(offsetY / BASE_CELL_SIZE) - BUFFER;
    const endRow = Math.ceil((offsetY + viewportHeight / transform.scale) / BASE_CELL_SIZE) + BUFFER;

    const cells = [];

    for (let y = Math.max(0, startRow); y < Math.min(GRID_HEIGHT, endRow); y++) {
      for (let x = Math.max(0, startCol); x < Math.min(GRID_WIDTH, endCol); x++) {
        const key = `${x}-${y}`;
        const cell = faceMap.get(key) || null;
        cells.push({ x, y, cell });
      }
    }

    return cells;
  }, [transform, faceMap]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      <TransformWrapper
        minScale={1}
        maxScale={3}
        initialScale={1}
        wheel={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        onTransformed={({ state }) =>
          setTransform({
            scale: state.scale,
            positionX: state.positionX,
            positionY: state.positionY,
          })
        }
      >
        <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
          <div
            style={{
              width: GRID_WIDTH * BASE_CELL_SIZE,
              height: GRID_HEIGHT * BASE_CELL_SIZE,
              position: "relative",
            }}
          >
            {visibleCells.map(({ x, y, cell }) => (
              <div className="jft"
                key={`${x}-${y}`}
                style={{
                  position: "absolute",
                  left: x * BASE_CELL_SIZE,
                  top: y * BASE_CELL_SIZE,
                  width: BASE_CELL_SIZE,
                  height: BASE_CELL_SIZE,
                }}
              >
                <div className="w-full h-full">
                   <AvatarCell data={cell} imageSize={BASE_CELL_SIZE * transform.scale} />
                </div>
                
              </div>
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};