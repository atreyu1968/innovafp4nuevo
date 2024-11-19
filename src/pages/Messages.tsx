import React, { useState } from 'react';
import { Send, Plus, Search, Mail } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useMessageStore } from '../stores/messageStore';
import { useUserStore } from '../stores/userStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import NewMessageModal from '../components/messages/NewMessageModal';
import ConversationList from '../components/messages/ConversationList';
import MessageThread from '../components/messages/MessageThread';

const Messages = () => {
  const { user } = useAuthStore();
  const { users } = useUserStore();
  const { messages, sendMessage, markAsRead, getConversation } = useMessageStore();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  const filteredUsers = users.filter((u) =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentConversation = selectedUserId ? getConversation(selectedUserId) : [];

  const handleSendMessage = (recipientId: string, subject: string, content: string) => {
    sendMessage({
      senderId: user.id,
      recipientId,
      subject,
      content,
    });
  };

  return (
    <div className="h-[calc(100vh-10rem)] flex">
      {/* Lista de conversaciones */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => setShowNewMessage(true)}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Mensaje
          </button>
          <div className="mt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <ConversationList
          users={filteredUsers}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />
      </div>

      {/* Mensajes */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedUserId ? (
          <MessageThread
            messages={currentConversation}
            recipient={users.find(u => u.id === selectedUserId)!}
            onSendMessage={(content) => handleSendMessage(selectedUserId, '', content)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Mail className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay mensajes seleccionados</h3>
              <p className="mt-1 text-sm text-gray-500">
                Selecciona una conversación o inicia una nueva
              </p>
            </div>
          </div>
        )}
      </div>

      {showNewMessage && (
        <NewMessageModal
          onClose={() => setShowNewMessage(false)}
          onSend={(recipientId, subject, content) => {
            handleSendMessage(recipientId, subject, content);
            setShowNewMessage(false);
            setSelectedUserId(recipientId);
          }}
        />
      )}
    </div>
  );
};

export default Messages;