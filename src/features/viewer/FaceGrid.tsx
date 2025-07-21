import React, { useEffect, useRef, useState } from "react";
import { useLayoutEffect } from "react";
import { mockFaces } from "./mockFaces";
import { AvatarCell } from "../../components/AvatarCell";
import type { FaceCell } from "../../models/FaceCell";
import { FaceModal } from "../../components/FaceModal";

const GRID_SIZE = 1000;
const CELL_SIZE = 20;
const mockCells = mockFaces;

function getImageSizeByZoom(zoom: number): number {
  console.log("zoome size:");
  console.log(zoom);
  if (zoom < 1) return 20;
  if (zoom < 2) return 40;
  if (zoom < 4) return 60;
  return 100;
}

export const FaceGrid: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<FaceCell | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [visibleCells, setVisibleCells] = useState<{ x: number; y: number }[]>(
    []
  );
  const imageSize = getImageSizeByZoom(zoom);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const initialZoom = 1;
    const totalGridSize = GRID_SIZE * CELL_SIZE * initialZoom;

    const initialOffsetX = (screenWidth - totalGridSize) / 2;
    const initialOffsetY = (screenHeight - totalGridSize) / 2;

    setZoom(initialZoom);
    setOffset({ x: initialOffsetX, y: initialOffsetY });
  }, []);

  let animationFrame: number | null = null;

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
    }

    animationFrame = requestAnimationFrame(() => {
      const scaleAmount = -e.deltaY * 0.0005;
      const newZoom = zoom * (1 + scaleAmount);
      const clampedZoom = Math.min(4, Math.max(1, newZoom));

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const dx = (mouseX - offset.x) / zoom;
      const dy = (mouseY - offset.y) / zoom;

      const newOffsetX = mouseX - dx * clampedZoom;
      const newOffsetY = mouseY - dy * clampedZoom;

      setZoom(clampedZoom);
      setOffset({ x: newOffsetX, y: newOffsetY });
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...offset };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({
      x: offsetStart.current.x + dx,
      y: offsetStart.current.y + dy,
    });
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const updateVisibleCells = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const scaledCellSize = CELL_SIZE * zoom;

    const startX = Math.floor(-offset.x / scaledCellSize);
    const startY = Math.floor(-offset.y / scaledCellSize);
    const endX = Math.ceil((screenWidth - offset.x) / scaledCellSize);
    const endY = Math.ceil((screenHeight - offset.y) / scaledCellSize);

    const cells = [];
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
          cells.push({ x, y });
        }
      }
    }

    setVisibleCells(cells);
  };

  useEffect(() => {
    updateVisibleCells();
  }, [zoom, offset]);

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container?.removeEventListener("wheel", handleWheel);
    };
  }, [zoom, offset]);

  return (
    <div
      ref={containerRef}
      className="w-screen h-screen overflow-hidden bg-black text-white relative touch-none"
    >
      <div
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
          transformOrigin: "top left",
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          position: "absolute",
        }}
      >
        {visibleCells.map(({ x, y }) => {
          const cell = mockCells.find((c) => c.x === x && c.y === y);

          return (
            <div
              key={`${x}-${y}`}
              style={{
                position: "absolute",
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            >
              {cell ? (
                <AvatarCell
                  data={cell}
                  imageSize={imageSize}
                  onClick={setSelected}
                />
              ) : (
                <div className="w-full h-full bg-gray-900" />
              )}
            </div>
          );
        })}
        {selected && (
          <FaceModal data={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
};
