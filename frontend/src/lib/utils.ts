import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from 'axios'

export const SERVER_URL = import.meta.env.VITE_SERVER_URL

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BACKEND_URL = "http://localhost:3000"

export default axios.create({baseURL: SERVER_URL, withCredentials: true})

export const ACTIONS = {
  CONNECT: "connect", // When a user connects to the socket
  DISCONNECT: "disconnect", // When a user disconnects

  JOIN_ROOM: "join:room", // When a user joins a specific room
  LEAVE_ROOM: "leave:room", // When a user leaves a specific room
  DELETE_ROOM: "delete:room", // When a room is deleted

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
