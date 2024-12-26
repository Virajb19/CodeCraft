import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACKEND_URL = "http://localhost:3000"

export default axios.create({baseURL: BACKEND_URL})

export type Execution = {
  error: string | null;
  id: string;
  createdAt: Date;
  language: string;
  code: string;
  output: string | null;
  userId: number;
}

export type Snippet = {
  id: string;
  createdAt: Date;
  userId: number;
  title: string;
  language: string;
  code: string;
}
