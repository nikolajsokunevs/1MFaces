export interface FaceCell {
  id: string;
  x: number;
  y: number;
  imageUrl: string;
  name?: string;
  country?: string;
  age?: number;
  sex?: "male" | "female";
  bio?: string;
  social?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    website?: string;
  };
}