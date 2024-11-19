import { create } from 'zustand';
import { Message, Conversation } from '../types/message';
import { useAuthStore } from './authStore';

interface MessageState {
  messages: Message[];
  conversations: Conversation[];
  sendMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  markAsRead: (messageId: string) => void;
  getConversation: (userId: string) => Message[];
  getUnreadCount: () => number;
  getUnreadMessages: () => Message[];
  deleteMessage: (messageId: string) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  conversations: [],

  sendMessage: (messageData) => {
    const newMessage: Message = {
      ...messageData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, newMessage],
      conversations: updateConversations(state.conversations, newMessage),
    }));
  },

  markAsRead: (messageId) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId
          ? { ...msg, readAt: new Date().toISOString() }
          : msg
      ),
    }));
  },

  getConversation: (userId) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return [];

    return get().messages.filter(
      (msg) =>
        (msg.senderId === currentUser.id && msg.recipientId === userId) ||
        (msg.senderId === userId && msg.recipientId === currentUser.id)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  getUnreadCount: () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return 0;

    return get().messages.filter(
      (msg) => msg.recipientId === currentUser.id && !msg.readAt
    ).length;
  },

  getUnreadMessages: () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return [];

    return get().messages
      .filter((msg) => msg.recipientId === currentUser.id && !msg.readAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  deleteMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    }));
  },
}));

function updateConversations(conversations: Conversation[], newMessage: Message): Conversation[] {
  const conversationId = [newMessage.senderId, newMessage.recipientId].sort().join('-');
  const existingIndex = conversations.findIndex((c) => c.id === conversationId);

  if (existingIndex >= 0) {
    const updated = [...conversations];
    updated[existingIndex] = {
      ...updated[existingIndex],
      lastMessage: newMessage,
      unreadCount: updated[existingIndex].unreadCount + 1,
    };
    return updated;
  }

  return [
    ...conversations,
    {
      id: conversationId,
      participants: [newMessage.senderId, newMessage.recipientId],
      lastMessage: newMessage,
      unreadCount: 1,
    },
  ];
}