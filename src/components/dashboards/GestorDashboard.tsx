import React from 'react';
import { FileText, Users, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useFormStore } from '../../stores/formStore';
import { useUserStore } from '../../stores/userStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import StatsCard from '../ui/StatsCard';

const GestorDashboard = () => {
  const { user } = useAuthStore();
  const { forms, getResponsesByForm } = useFormStore();
  const { users } = useUserStore();
  const { activeYear } = useAcademicYearStore();

  // Get forms assigned to this gestor
  const assignedForms = forms.filter(
    form => form.status === 'published' && 
    form.assignedRoles.includes('gestor') &&
    form.academicYearId === activeYear?.id
  );

  // Get pending forms (no response yet)
  const pendingForms = assignedForms.filter(
    form => !getResponsesByForm(form.id).find(r => r.userId === user?.id)
  );

  // Get users from same center
  const centerUsers = users.filter(
    u => u.active && 
    u.centro === user?.centro &&
    u.academicYearId === activeYear?.id
  );

  const stats = [
    {
      title: 'Formularios Pendientes',
      value: pendingForms.length.toString(),
      icon: FileText,
      description: 'Por completar',
    },
    {
      title: 'Formularios Asignados',
      value: assignedForms.length.toString(),
      icon: BookOpen,
      description: 'En el curso actual',
    },
    {
      title: 'Participantes',
      value: centerUsers.length.toString(),
      icon: Users,
      description: `En ${user?.centro}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Formularios Pendientes</h3>
            <div className="mt-4">
              <div className="space-y-4">
                {pendingForms.map((form) => (
                  <div key={form.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{form.title}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  </div>
                ))}
                {pendingForms.length === 0 && (
                  <p className="text-sm text-gray-500">No hay formularios pendientes</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Participantes del Centro</h3>
            <div className="mt-4">
              <div className="space-y-4">
                {centerUsers.slice(0, 5).map((centerUser) => (
                  <div key={centerUser.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {centerUser.nombre} {centerUser.apellidos}
                    </span>
                    <span className="text-sm text-gray-500">
                      {centerUser.familiaProfesional}
                    </span>
                  </div>
                ))}
                {centerUsers.length === 0 && (
                  <p className="text-sm text-gray-500">No hay participantes registrados</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestorDashboard;