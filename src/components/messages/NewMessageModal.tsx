import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useAuthStore } from '../../stores/authStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import TextareaAutosize from 'react-textarea-autosize';

interface NewMessageModalProps {
  onClose: () => void;
  onSend: (recipientId: string, subject: string, content: string) => void;
}

const NewMessageModal: React.FC<NewMessageModalProps> = ({ onClose, onSend }) => {
  const { users } = useUserStore();
  const { user: currentUser } = useAuthStore();
  const { activeYear } = useAcademicYearStore();
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter active users from the current academic year only
  const filteredUsers = users.filter(
    (user) => 
      user.id !== currentUser?.id && 
      user.active && 
      user.academicYearId === activeYear?.id &&
      (user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientId || !content.trim()) return;
    onSend(recipientId, subject, content);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-medium">Nuevo Mensaje</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Para
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  placeholder="Buscar usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {searchTerm && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-48 overflow-y-auto">
                    {filteredUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setRecipientId(user.id);
                          setSearchTerm(`${user.nombre} ${user.apellidos}`);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="font-medium text-gray-900">
                          {user.nombre} {user.apellidos}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">
                          {user.centro || user.subred || 'Coordinación General'}
                        </div>
                      </button>
                    ))}
                    {filteredUsers.length === 0 && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No se encontraron usuarios
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Asunto
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mensaje
              </label>
              <TextareaAutosize
                value={content}
                onChange={(e) => setContent(e.target.value)}
                minRows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                required
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!recipientId || !content.trim()}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewMessageModal;