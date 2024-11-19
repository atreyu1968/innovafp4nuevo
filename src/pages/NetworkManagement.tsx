import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useAcademicYearStore } from '../stores/academicYearStore';
import SubnetList from '../components/networks/SubnetList';
import CenterList from '../components/networks/CenterList';
import FamilyList from '../components/networks/FamilyList';
import CenterTypeList from '../components/networks/CenterTypeList';
import SubnetForm from '../components/networks/SubnetForm';
import CenterForm from '../components/networks/CenterForm';
import FamilyForm from '../components/networks/FamilyForm';
import CenterTypeForm from '../components/networks/CenterTypeForm';

const NetworkManagement = () => {
  const { user } = useAuthStore();
  const { activeYear } = useAcademicYearStore();
  const [showSubnetForm, setShowSubnetForm] = useState(false);
  const [showCenterForm, setShowCenterForm] = useState(false);
  const [showFamilyForm, setShowFamilyForm] = useState(false);
  const [showCenterTypeForm, setShowCenterTypeForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'subnets' | 'centers' | 'families' | 'centerTypes'>('subnets');

  if (user?.role !== 'coordinador_general') {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          No tienes permisos para acceder a esta sección.
        </p>
      </div>
    );
  }

  if (!activeYear) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">
          Debes activar un curso académico para gestionar la red.
        </p>
      </div>
    );
  }

  const getAddButtonText = () => {
    switch (selectedTab) {
      case 'subnets':
        return 'Nueva Subred';
      case 'centers':
        return 'Nuevo Centro';
      case 'families':
        return 'Nueva Familia Profesional';
      case 'centerTypes':
        return 'Nuevo Tipo de Centro';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Red</h2>
          <p className="mt-1 text-sm text-gray-500">
            Administración de subredes, centros educativos y familias profesionales
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => {
              switch (selectedTab) {
                case 'subnets':
                  setShowSubnetForm(true);
                  break;
                case 'centers':
                  setShowCenterForm(true);
                  break;
                case 'families':
                  setShowFamilyForm(true);
                  break;
                case 'centerTypes':
                  setShowCenterTypeForm(true);
                  break;
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {getAddButtonText()}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setSelectedTab('subnets')}
              className={`py-4 px-6 text-sm font-medium ${
                selectedTab === 'subnets'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Subredes
            </button>
            <button
              onClick={() => setSelectedTab('centers')}
              className={`py-4 px-6 text-sm font-medium ${
                selectedTab === 'centers'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Centros Educativos
            </button>
            <button
              onClick={() => setSelectedTab('families')}
              className={`py-4 px-6 text-sm font-medium ${
                selectedTab === 'families'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Familias Profesionales
            </button>
            <button
              onClick={() => setSelectedTab('centerTypes')}
              className={`py-4 px-6 text-sm font-medium ${
                selectedTab === 'centerTypes'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Tipos de Centro
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'subnets' ? (
            showSubnetForm ? (
              <SubnetForm
                onSubmit={() => setShowSubnetForm(false)}
                onCancel={() => setShowSubnetForm(false)}
              />
            ) : (
              <SubnetList onEdit={() => setShowSubnetForm(true)} />
            )
          ) : selectedTab === 'centers' ? (
            showCenterForm ? (
              <CenterForm
                onSubmit={() => setShowCenterForm(false)}
                onCancel={() => setShowCenterForm(false)}
              />
            ) : (
              <CenterList onEdit={() => setShowCenterForm(true)} />
            )
          ) : selectedTab === 'families' ? (
            showFamilyForm ? (
              <FamilyForm
                onSubmit={() => setShowFamilyForm(false)}
                onCancel={() => setShowFamilyForm(false)}
              />
            ) : (
              <FamilyList onEdit={() => setShowFamilyForm(true)} />
            )
          ) : showCenterTypeForm ? (
            <CenterTypeForm
              onSubmit={() => setShowCenterTypeForm(false)}
              onCancel={() => setShowCenterTypeForm(false)}
            />
          ) : (
            <CenterTypeList onEdit={() => setShowCenterTypeForm(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkManagement;