import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACKEND_URL = "http://localhost:3000"

export default axios.create({baseURL: BACKEND_URL})

