import React from 'react';
import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { AcademicYear } from '../../types/academicYear';

interface AcademicYearListProps {
  academicYears: AcademicYear[];
  onYearClick: (year: AcademicYear) => void;
}

const statusIcons = {
  active: CheckCircle,
  pending: Clock,
  finished: XCircle,
};

const statusColors = {
  active: 'text-green-500 bg-green-100',
  pending: 'text-yellow-500 bg-yellow-100',
  finished: 'text-gray-500 bg-gray-100',
};

const AcademicYearList: React.FC<AcademicYearListProps> = ({
  academicYears,
  onYearClick,
}) => {
  return (
    <div className="space-y-4">
      {academicYears.map((year) => {
        const StatusIcon = statusIcons[year.status];
        const statusColor = statusColors[year.status];

        return (
          <button
            key={year.id}
            onClick={() => onYearClick(year)}
            className="w-full text-left block bg-white border rounded-lg p-4 hover:border-blue-500 transition-colors duration-150"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {year.year}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(year.startDate).toLocaleDateString()} -{' '}
                    {new Date(year.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                >
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {year.status.charAt(0).toUpperCase() + year.status.slice(1)}
                </span>
              </div>
            </div>
            {year.description && (
              <p className="mt-2 text-sm text-gray-600">{year.description}</p>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default AcademicYearList;