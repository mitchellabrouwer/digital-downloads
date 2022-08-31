import { NextApiRequest } from "next";

export interface Request extends NextApiRequest {
  files?: {
    product: string;
    image: {
      path: string;
      originalFilename: string;
      size: number;
    }[];
    video: { path: string; originalFilename: string; size: number }[];
  };
}
