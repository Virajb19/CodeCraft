import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACKEND_URL = "http://localhost:3000"

export const CHECKOUT_URL = "https://viraj.lemonsqueezy.com/buy/5dd8c3fd-7f6d-4044-a789-55ecd6c45b6c"

export default axios.create({baseURL: BACKEND_URL})

export const ACTIONS = {
  JOIN: "join",
  JOINED: "joined",
  DISCONNECTED: "disconnected",
  CODE_CHANGE: "code-change",
  SYNC_CODE: "sync-code",
  LEAVE: "leave",
}

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
  comments: Comment[]
}

export type Room = {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: number;
  owner: { username: string,  ProfilePicture: string | null}
  participants:  {id: number, username: string,  ProfilePicture: string | null} []
}

export type Comment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  snippetId: string;
  content: string;
  author: {
    ProfilePicture: string | null;
    username: string
  }
}
