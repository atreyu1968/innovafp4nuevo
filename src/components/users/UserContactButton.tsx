import React, { useState } from 'react';
import { Mail, Phone, Send, X } from 'lucide-react';
import { useNotifications } from '../notifications/NotificationProvider';

interface UserContactButtonProps {
  type: 'email' | 'phone';
  value: string;
  className?: string;
}

const UserContactButton: React.FC<UserContactButtonProps> = ({ type, value, className = '' }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const { showNotification } = useNotifications();

  const handleContact = () => {
    if (type === 'phone') {
      window.location.href = `tel:${value}`;
    } else {
      setShowEmailModal(true);
    }
  };

  const EmailModal = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSend = () => {
      // Construir el mailto URL con el asunto y mensaje
      const mailtoUrl = `mailto:${value}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoUrl;
      showNotification('success', 'Correo abierto en tu cliente de email');
      setShowEmailModal(false);
    };

    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-medium">Nuevo Correo</h3>
            <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Para</label>
              <input
                type="text"
                value={value}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Asunto</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mensaje</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              onClick={() => setShowEmailModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSend}
              disabled={!subject.trim() || !message.trim()}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4 mr-2 inline-block" />
              Enviar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={handleContact}
        className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors ${className}`}
        title={type === 'email' ? 'Enviar correo' : 'Llamar'}
      >
        {type === 'email' ? (
          <Mail className="h-4 w-4 mr-2" />
        ) : (
          <Phone className="h-4 w-4 mr-2" />
        )}
        {value}
      </button>

      {showEmailModal && <EmailModal />}
    </>
  );
};

export default UserContactButton;