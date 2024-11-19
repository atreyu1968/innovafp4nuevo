import React from 'react';
import { Calendar, School } from 'lucide-react';
import { useAcademicYearStore } from '../../stores/academicYearStore';

const CurrentAcademicYear = () => {
  const activeYear = useAcademicYearStore((state) => state.activeYear);

  if (!activeYear) {
    return (
      <div className="bg-yellow-50 p-4 rounded-md">
        <p className="text-yellow-700">No hay un curso académico activo.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">
          Curso Académico Actual
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <h4 className="font-medium text-gray-900">{activeYear.year}</h4>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(activeYear.startDate).toLocaleDateString()} - {' '}
            {new Date(activeYear.endDate).toLocaleDateString()}
          </p>
          {activeYear.description && (
            <p className="mt-2 text-sm text-gray-600">{activeYear.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center space-x-2">
              <School className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">CIFP</p>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">5</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center space-x-2">
              <School className="h-4 w-4 text-blue-600" />
              <p className="text-sm text-gray-500">IES</p>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentAcademicYear;