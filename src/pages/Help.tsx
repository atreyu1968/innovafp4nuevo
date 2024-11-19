import React from 'react';
import { Book, Search } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import WikiContent from '../components/help/WikiContent';
import WikiSearch from '../components/help/WikiSearch';

const Help = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Centro de Ayuda</h2>
          <p className="mt-1 text-sm text-gray-500">
            Guía y documentación de la Red de Innovación FP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <div className="mb-4">
            <WikiSearch onSearch={setSearchQuery} />
          </div>
          <nav className="space-y-1">
            <h3 className="font-medium text-gray-900 px-3 py-2">
              Contenido
            </h3>
            <a
              href="#inicio"
              className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md"
            >
              Inicio
            </a>
            <a
              href="#funcionalidades"
              className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md"
            >
              Funcionalidades principales
            </a>
            <a
              href="#rol"
              className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md"
            >
              Tu rol y permisos
            </a>
            <a
              href="#guias"
              className="block px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md"
            >
              Guías paso a paso
            </a>
          </nav>
        </div>

        <div className="lg:col-span-3">
          <WikiContent role={user?.role} searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default Help;