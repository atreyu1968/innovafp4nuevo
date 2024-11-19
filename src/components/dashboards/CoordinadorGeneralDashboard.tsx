import React from 'react';
import { Network, FileText, Users, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useFormStore } from '../../stores/formStore';
import { useUserStore } from '../../stores/userStore';
import { useNetworkStore } from '../../stores/networkStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import StatsCard from '../ui/StatsCard';

const CoordinadorGeneralDashboard = () => {
  const { activeYear } = useAcademicYearStore();
  const { subnets, centers } = useNetworkStore();
  const { users } = useUserStore();
  const { forms, getResponsesByForm } = useFormStore();

  // Get active subnets for current year
  const activeSubnets = subnets.filter(
    subnet => subnet.active && subnet.academicYearId === activeYear?.id
  );

  // Get active centers for current year
  const activeCenters = centers.filter(
    center => center.active && center.academicYearId === activeYear?.id
  );

  // Get active users for current year
  const activeUsers = users.filter(
    user => user.active && user.academicYearId === activeYear?.id
  );

  // Get active forms and their responses for current year
  const activeFormResponses = forms
    .filter(form => form.academicYearId === activeYear?.id)
    .flatMap(form => getResponsesByForm(form.id)
      .filter(response => response.academicYearId === activeYear?.id)
    );

  const stats = [
    {
      title: 'Total Subredes',
      value: activeSubnets.length.toString(),
      icon: Network,
      description: 'Activas',
    },
    {
      title: 'Total Centros',
      value: activeCenters.length.toString(),
      icon: FileText,
      description: 'Participantes',
    },
    {
      title: 'Total Participantes',
      value: activeUsers.length.toString(),
      icon: Users,
      description: 'En toda la red',
    },
    {
      title: 'Informes Enviados',
      value: activeFormResponses.length.toString(),
      icon: TrendingUp,
      description: 'Este curso',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Estado por Subredes</h3>
            <div className="mt-4">
              <div className="space-y-4">
                {activeSubnets.map((subnet) => {
                  // Get centers for this subnet
                  const subnetCenters = activeCenters.filter(c => c.subnetId === subnet.id);
                  
                  // Get users for this subnet
                  const subnetUsers = activeUsers.filter(u => u.subred === subnet.name);
                  
                  // Get responses for this subnet's users
                  const subnetResponses = activeFormResponses.filter(
                    r => subnetUsers.some(u => u.id === r.userId)
                  );

                  // Calculate progress percentage
                  const totalPossibleResponses = subnetUsers.length * forms.filter(
                    f => f.academicYearId === activeYear?.id
                  ).length;

                  const progress = totalPossibleResponses > 0
                    ? Math.round((subnetResponses.length / totalPossibleResponses) * 100)
                    : 0;

                  return (
                    <div key={subnet.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          {subnet.name}
                        </span>
                        <div className="text-sm text-gray-500">
                          <span className="mr-4">{subnetCenters.length} centros</span>
                          <span>{subnetUsers.length} usuarios</span>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-100">
                          <div
                            style={{ width: `${progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                {activeSubnets.length === 0 && (
                  <p className="text-sm text-gray-500">No hay subredes activas</p>
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
                  {activeFormResponses.slice(0, 5).map((response) => {
                    const responseUser = activeUsers.find(u => u.id === response.userId);
                    const responseForm = forms.find(f => f.id === response.formId);
                    
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
                                {responseUser?.nombre} {responseUser?.apellidos} ({responseUser?.subred || responseUser?.centro}){' '}
                                ha enviado {responseForm?.title}
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
                  {activeFormResponses.length === 0 && (
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

export default CoordinadorGeneralDashboard;