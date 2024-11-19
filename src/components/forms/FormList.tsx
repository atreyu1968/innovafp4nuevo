import React from 'react';
import { FileText, Calendar, CheckCircle, Clock, Lock, Plus, Edit2, Copy, Trash2, Eye, ToggleLeft } from 'lucide-react';
import { Form, FormStatus } from '../../types/form';
import { useFormStore } from '../../stores/formStore';
import { useAuthStore } from '../../stores/authStore';

interface FormListProps {
  forms: Form[];
  isAdmin: boolean;
  onFormClick: (form: Form) => void;
  onViewResponses: (form: Form) => void;
  onDuplicate: (form: Form) => void;
  onDelete: (formId: string) => void;
  onToggleStatus: (form: Form) => void;
  onToggleResponses: (form: Form) => void;
}

const statusIcons = {
  borrador: Clock,
  publicado: CheckCircle,
  cerrado: Lock,
};

const statusColors = {
  borrador: 'text-yellow-500 bg-yellow-100',
  publicado: 'text-green-500 bg-green-100',
  cerrado: 'text-gray-500 bg-gray-100',
};

const statusLabels = {
  borrador: 'Borrador',
  publicado: 'Publicado',
  cerrado: 'Cerrado',
};

const FormList: React.FC<FormListProps> = ({
  forms,
  isAdmin,
  onFormClick,
  onViewResponses,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onToggleResponses,
}) => {
  const { user } = useAuthStore();

  const getStatusColor = (status: FormStatus) => statusColors[status];
  const getStatusLabel = (status: FormStatus) => statusLabels[status];
  const StatusIcon = (props: { status: FormStatus }) => {
    const Icon = statusIcons[props.status];
    return <Icon className="h-4 w-4 mr-1" />;
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {forms.map((form) => (
          <li key={form.id} className="hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {form.title}
                    </h3>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <span>
                        {form.startDate && form.endDate
                          ? `${new Date(form.startDate).toLocaleDateString()} - ${new Date(
                              form.endDate
                            ).toLocaleDateString()}`
                          : 'Sin fechas definidas'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm text-gray-500 mr-4">
                        Asignado a: {form.assignedRoles.map(role => {
                          switch(role) {
                            case 'gestor': return 'Gestores';
                            case 'coordinador_subred': return 'Coordinadores de Subred';
                            case 'coordinador_general': return 'Coordinadores Generales';
                            default: return role;
                          }
                        }).join(', ')}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(form.status)}`}
                      >
                        <StatusIcon status={form.status} />
                        {getStatusLabel(form.status)}
                      </span>
                      {form.status === 'publicado' && (
                        <>
                          <span
                            className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              form.acceptingResponses
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {form.acceptingResponses ? 'Aceptando respuestas' : 'No acepta respuestas'}
                          </span>
                          <span
                            className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {form.allowMultipleResponses ? 'Múltiples respuestas' : 'Respuesta única'}
                          </span>
                        </>
                      )}
                      {form.createdByName && (
                        <span className="ml-2 text-sm text-gray-500">
                          Creado por: {form.createdByName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => onFormClick(form)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                        title="Editar formulario"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDuplicate(form)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                        title="Duplicar formulario"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onViewResponses(form)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                        title="Ver respuestas"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {form.status === 'publicado' && (
                        <button
                          onClick={() => onToggleResponses(form)}
                          className="p-2 text-gray-400 hover:text-gray-500"
                          title={form.acceptingResponses ? 'Pausar respuestas' : 'Reanudar respuestas'}
                        >
                          <ToggleLeft className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => onToggleStatus(form)}
                        className="p-2 text-gray-400 hover:text-gray-500"
                        title={form.status === 'publicado' ? 'Cerrar formulario' : 'Publicar formulario'}
                      >
                        {form.status === 'publicado' ? (
                          <Lock className="h-5 w-5" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => onDelete(form.id)}
                        className="p-2 text-red-400 hover:text-red-500 group relative"
                        title="Eliminar formulario"
                      >
                        <Trash2 className="h-5 w-5" />
                        <span className="absolute bottom-full right-0 mb-2 w-48 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Doble confirmación requerida
                        </span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onFormClick(form)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      {form.status === 'publicado' ? 'Responder' : 'Ver'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
        {forms.length === 0 && (
          <li className="px-4 py-8 text-center text-gray-500">
            No hay formularios disponibles
          </li>
        )}
      </ul>
    </div>
  );
};

export default FormList;