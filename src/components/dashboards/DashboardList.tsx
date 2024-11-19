import React from 'react';
import { Edit2, Trash2, Menu } from 'lucide-react';
import { Dashboard } from '../../types/dashboard';
import { useAuthStore } from '../../stores/authStore';

interface DashboardListProps {
  dashboards: Dashboard[];
  onEdit: (dashboard: Dashboard) => void;
  onDelete: (id: string) => void;
  onAssignMenu: (dashboard: Dashboard) => void;
}

const DashboardList: React.FC<DashboardListProps> = ({
  dashboards,
  onEdit,
  onDelete,
  onAssignMenu,
}) => {
  const { user } = useAuthStore();

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {dashboards.map((dashboard) => (
          <li key={dashboard.id}>
            <div className="px-4 py-4 flex items-center justify-between sm:px-6">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{dashboard.title}</h3>
                {dashboard.description && (
                  <p className="mt-1 text-sm text-gray-500">{dashboard.description}</p>
                )}
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="mr-4">
                    Creado: {new Date(dashboard.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Última modificación: {new Date(dashboard.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2">
                  {dashboard.permissions.roles?.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onAssignMenu(dashboard)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Asignar a menú"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onEdit(dashboard)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Editar"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(dashboard.id)}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Eliminar"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
        {dashboards.length === 0 && (
          <li className="px-4 py-8 text-center text-gray-500">
            No se encontraron dashboards
          </li>
        )}
      </ul>
    </div>
  );
};

export default DashboardList;