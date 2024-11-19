import React from 'react';
import { Network, FileText, Users } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useFormStore } from '../../stores/formStore';
import { useUserStore } from '../../stores/userStore';
import { useNetworkStore } from '../../stores/networkStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import StatsCard from '../ui/StatsCard';

const CoordinadorSubredDashboard = () => {
  const { user } = useAuthStore();
  const { forms, getResponsesByForm } = useFormStore();
  const { users } = useUserStore();
  const { centers } = useNetworkStore();
  const { activeYear } = useAcademicYearStore();

  // Get centers in this subnet
  const subnetCenters = centers.filter(
    center => center.active && 
    center.subnetId === user?.subred &&
    center.academicYearId === activeYear?.id
  );

  // Get users in this subnet
  const subnetUsers = users.filter(
    u => u.active && 
    u.subred === user?.subred &&
    u.academicYearId === activeYear?.id
  );

  // Get forms assigned to this subnet
  const assignedForms = forms.filter(
    form => form.status === 'published' && 
    form.assignedRoles.includes('coordinador_subred') &&
    form.academicYearId === activeYear?.id
  );

  // Get responses from subnet users
  const formResponses = assignedForms.flatMap(form => 
    getResponsesByForm(form.id).filter(response => 
      subnetUsers.some(u => u.id === response.userId)
    )
  );

  const stats = [
    {
      title: 'Centros en la Subred',
      value: subnetCenters.length.toString(),
      icon: Network,
      description: user?.subred,
    },
    {
      title: 'Informes Recibidos',
      value: formResponses.length.toString(),
      icon: FileText,
      description: 'Este curso académico',
    },
    {
      title: 'Total Participantes',
      value: subnetUsers.length.toString(),
      icon: Users,
      description: 'En toda la subred',
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
            <h3 className="text-lg font-medium text-gray-900">Estado de Centros</h3>
            <div className="mt-4">
              <div className="space-y-4">
                {subnetCenters.map((center) => {
                  const centerUsers = subnetUsers.filter(u => u.centro === center.name);
                  const centerResponses = formResponses.filter(
                    r => centerUsers.some(u => u.id === r.userId)
                  );

                  return (
                    <div key={center.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">{center.name}</span>
                      <div className="text-sm text-gray-500">
                        <span className="mr-4">{centerUsers.length} usuarios</span>
                        <span>{centerResponses.length} informes</span>
                      </div>
                    </div>
                  );
                })}
                {subnetCenters.length === 0 && (
                  <p className="text-sm text-gray-500">No hay centros asignados</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Actividad Reciente</h3>
            <div className="mt-4">
              <div className="flow-root">
                <ul className="-mb-8">
                  {formResponses.slice(0, 5).map((response, idx) => {
                    const responseUser = subnetUsers.find(u => u.id === response.userId);
                    const responseForm = assignedForms.find(f => f.id === response.formId);
                    
                    return (
                      <li key={response.id}>
                        <div className="relative pb-8">
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                <FileText className="h-5 w-5 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-gray-500">
                                {responseUser?.nombre} {responseUser?.apellidos} ha enviado{' '}
                                {responseForm?.title}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                {new Date(response.submissionTimestamp || '').toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                  {formResponses.length === 0 && (
                    <p className="text-sm text-gray-500">No hay actividad reciente</p>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordinadorSubredDashboard;