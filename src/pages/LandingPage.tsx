import React from 'react';
import { Network, Users, BookOpen, BarChart3 } from 'lucide-react';

const features = [
  {
    icon: Network,
    title: 'Gestión de Subredes',
    description: 'Coordina y supervisa las diferentes subredes de innovación en FP.',
  },
  {
    icon: Users,
    title: 'Roles Específicos',
    description: 'Sistema de permisos para gestores, coordinadores de subred y coordinación general.',
  },
  {
    icon: BookOpen,
    title: 'Cursos Académicos',
    description: 'Organización y seguimiento por períodos académicos.',
  },
  {
    icon: BarChart3,
    title: 'Informes Detallados',
    description: 'Generación y visualización de informes personalizados.',
  },
];

const LandingPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
          Red de Innovación FP
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Plataforma centralizada para la gestión y coordinación de la red de innovación
          en Formación Profesional.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16 bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Estructura de la Red
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-2 border-blue-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">
              Coordinación General
            </h3>
            <p className="text-gray-600">
              Supervisión y gestión central desde la dirección general de FP
            </p>
          </div>
          <div className="border-2 border-blue-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">
              Coordinadores de Subred
            </h3>
            <p className="text-gray-600">
              Gestión y coordinación de CIFP y centros asociados
            </p>
          </div>
          <div className="border-2 border-blue-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">
              Gestores de Red
            </h3>
            <p className="text-gray-600">
              Responsables de la implementación en cada centro educativo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;