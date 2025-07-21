import React from "react";
import type { FaceCell } from "../models/FaceCell";

interface FaceModalProps {
  data: FaceCell;
  onClose: () => void;
}

export const FaceModal: React.FC<FaceModalProps> = ({ data, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white text-black p-6 rounded-xl w-80 relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={data.imageUrl + "/900"}
          alt=""
          className="w-700 h-700 rounded-30 mx-auto mb-4 object-cover"
        />
        <h2 className="text-xl font-semibold text-center">
          {data.name || "Аноним"}
        </h2>
        <p className="text-center text-gray-500">
          {data.country || "Без страны"}
        </p>
      </div>
    </div>
  );
};