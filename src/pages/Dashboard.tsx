import React from 'react';
import { useAuthStore } from '../stores/authStore';
import GestorDashboard from '../components/dashboards/GestorDashboard';
import CoordinadorSubredDashboard from '../components/dashboards/CoordinadorSubredDashboard';
import CoordinadorGeneralDashboard from '../components/dashboards/CoordinadorGeneralDashboard';
import CurrentAcademicYear from '../components/academicYears/CurrentAcademicYear';

const Dashboard = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const DashboardComponent = {
    gestor: GestorDashboard,
    coordinador_subred: CoordinadorSubredDashboard,
    coordinador_general: CoordinadorGeneralDashboard,
  }[user.role];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">Panel de Control</h1>
        <p className="mt-2 text-sm text-gray-600">
          Bienvenido, {user.nombre} - {user.centro || user.subred || 'Coordinación General'}
        </p>
      </div>

      {user.role !== 'coordinador_general' && <CurrentAcademicYear />}
      
      <DashboardComponent />
    </div>
  );
};

export default Dashboard;