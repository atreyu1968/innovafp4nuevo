import { User } from './user';

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  attachments?: MessageAttachment[];
  reactions?: {
    emoji: string;
    userId: string;
  }[];
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}