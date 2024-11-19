import React, { useState } from 'react';
import { Plus, Search, Upload, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../stores/dashboardStore';
import { useAcademicYearStore } from '../stores/academicYearStore';
import { useFormStore } from '../stores/formStore';
import { useAuthStore } from '../stores/authStore';
import { Dashboard } from '../types/dashboard';
import DashboardList from '../components/dashboards/DashboardList';
import ImportDashboardModal from '../components/dashboards/ImportDashboardModal';
import AssignMenuModal from '../components/dashboards/AssignMenuModal';

const DashboardManager = () => {
  const navigate = useNavigate();
  const { user, activeRole } = useAuthStore();
  const { dashboards, deleteDashboard } = useDashboardStore();
  const { activeYear } = useAcademicYearStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);

  // Only allow access to admin role
  if (user?.role !== 'coordinador_general' || activeRole !== 'admin') {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  const filteredDashboards = dashboards.filter(
    (dashboard) =>
      dashboard.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dashboard.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (dashboard: Dashboard) => {
    navigate(`/dashboard-builder/${dashboard.id}`);
  };

  const handleAssignMenu = (dashboard: Dashboard) => {
    setSelectedDashboard(dashboard);
    setShowAssignModal(true);
  };

  const handleCreateNew = () => {
    navigate('/dashboard-builder');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Dashboards</h2>
          <p className="mt-1 text-sm text-gray-500">
            {activeYear ? `Curso académico: ${activeYear.year}` : 'Todos los cursos'}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </button>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Dashboard
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Buscar dashboards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <DashboardList
        dashboards={filteredDashboards}
        onEdit={handleEdit}
        onDelete={deleteDashboard}
        onAssignMenu={handleAssignMenu}
      />

      {showImportModal && (
        <ImportDashboardModal onClose={() => setShowImportModal(false)} />
      )}

      {showAssignModal && selectedDashboard && (
        <AssignMenuModal
          dashboard={selectedDashboard}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedDashboard(null);
          }}
        />
      )}
    </div>
  );
};

export default DashboardManager;