import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Send, Paperclip, Smile, X, Image as ImageIcon, FileText, Download } from 'lucide-react';
import { Message, MessageAttachment } from '../../types/message';
import { User } from '../../types/user';
import { useAuthStore } from '../../stores/authStore';
import TextareaAutosize from 'react-textarea-autosize';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageThreadProps {
  messages: Message[];
  recipient: User;
  onSendMessage: (content: string, attachments?: MessageAttachment[]) => void;
}

const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  recipient,
  onSendMessage,
}) => {
  const { user: currentUser } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && attachments.length === 0) return;
    
    onSendMessage(newMessage, attachments);
    setNewMessage('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 5 * 1024 * 1024; // 5MB

    const newAttachments = await Promise.all(
      files.map(async (file) => {
        if (file.size > maxSize) {
          alert(`El archivo ${file.name} excede el límite de 5MB`);
          return null;
        }

        return new Promise<MessageAttachment>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: crypto.randomUUID(),
              name: file.name,
              type: file.type,
              size: file.size,
              url: reader.result as string,
              uploadedAt: new Date().toISOString(),
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setAttachments([...attachments, ...newAttachments.filter(Boolean) as MessageAttachment[]]);
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handleEmojiSelect = (emoji: any) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  const renderAttachmentPreview = (attachment: MessageAttachment) => {
    if (attachment.type.startsWith('image/')) {
      return (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="h-20 w-20 object-cover rounded"
        />
      );
    }
    return (
      <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>
    );
  };

  const renderMessageAttachments = (messageAttachments?: MessageAttachment[]) => {
    if (!messageAttachments?.length) return null;

    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        {messageAttachments.map(attachment => (
          <div key={attachment.id} className="relative group">
            {renderAttachmentPreview(attachment)}
            <a
              href={attachment.url}
              download={attachment.name}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded"
            >
              <Download className="h-6 w-6 text-white" />
            </a>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Cabecera */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-medium text-gray-900">
          {recipient.nombre} {recipient.apellidos}
        </h2>
        <p className="text-sm text-gray-500">{recipient.email}</p>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSender = message.senderId === currentUser?.id;

          return (
            <div
              key={message.id}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isSender
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {renderMessageAttachments(message.attachments)}
                <div className="flex items-center justify-between mt-1">
                  <p
                    className={`text-xs ${
                      isSender ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {format(new Date(message.createdAt), 'PPp', { locale: es })}
                  </p>
                  {message.reactions?.length > 0 && (
                    <div className="flex -space-x-1">
                      {message.reactions.map((reaction, index) => (
                        <span key={index} className="text-sm">
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulario de nuevo mensaje */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
        {attachments.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {attachments.map(attachment => (
              <div key={attachment.id} className="relative group">
                {renderAttachmentPreview(attachment)}
                <button
                  type="button"
                  onClick={() => removeAttachment(attachment.id)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Adjuntar archivo"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-500 hover:text-gray-700"
              title="Emoticonos"
            >
              <Smile className="h-5 w-5" />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                  locale="es"
                />
              </div>
            )}
          </div>

          <div className="flex-1">
            <TextareaAutosize
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe un mensaje..."
              className="block w-full resize-none rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              minRows={1}
              maxRows={5}
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() && attachments.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </>
  );
};

export default MessageThread;