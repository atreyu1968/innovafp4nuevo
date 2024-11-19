import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useMessageStore } from '../../stores/messageStore';
import { useUserStore } from '../../stores/userStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface NotificationsPopupProps {
  onClose: () => void;
}

const NotificationsPopup: React.FC<NotificationsPopupProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { getUnreadMessages } = useMessageStore();
  const { users } = useUserStore();
  const unreadMessages = getUnreadMessages();

  const handleMessageClick = (userId: string) => {
    navigate('/mensajes');
    onClose();
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {unreadMessages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {unreadMessages.map((message) => {
              const sender = users.find(u => u.id === message.senderId);
              return (
                <button
                  key={message.id}
                  onClick={() => handleMessageClick(message.senderId)}
                  className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {sender?.nombre} {sender?.apellidos}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{message.content}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(new Date(message.createdAt), 'PPp', { locale: es })}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No hay mensajes sin leer
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPopup;