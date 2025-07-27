import React from "react";

interface UploadModalProps {
  x: number;
  y: number;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ x, y, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white text-black p-6 rounded-xl w-96 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4 text-center">
          Upload new face
        </h2>
        <p className="text-center mb-4 text-gray-600">Координаты: {x}, {y}</p>
        <input type="file" accept="image/*" className="mb-4 w-full" />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          Upload
        </button>
      </div>
    </div>
  );
};