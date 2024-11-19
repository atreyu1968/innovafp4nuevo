import React, { useState } from 'react';
import { Save, Send } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

interface InnovationActionFormProps {
  onSubmit: (data: any, isDraft: boolean) => void;
  onCancel: () => void;
}

const NETWORKS = [
  'Red CIFP La Laguna',
  'Red CIFP Los Gladiolos',
  'Red CIFP Las Indias',
  'Red CIFP César Manrique',
  'Red Sur de Tenerife (CIFP Adeje)',
  'Red Lanzarote (CIFP Zonzamas)',
  'Red Fuerteventura (CIFP Majada Marcial)',
  'Red Ciudad y Este de Gran Canaria (CIFP San Cristóbal)',
  'Red centro de Gran Canaria (CIFP Cruz de Piedra)',
  'Red Sur Gran Canaria (CIFP Villa de Agüimes)',
  'Red Norte Gran Canaria (CIFP Tony Gallardo)',
  'Red La Palma (IES Virgen de las Nieves)',
  'Red Sur Gran Canaria II (CIFP Profesor Antonio Cabrera)',
  'Red Centro GranCanaria II (CIFP Felo Monzón Grau-Bassas)',
  'Red Virgen de Candelaria'
];

const CENTERS = [
  'IES ANA LUISA BENÍTEZ',
  'IES SANTA BRÍGIDA',
  'CIFP CRUZ DE PIEDRA',
  // ... resto de centros
];

const DEPARTMENTS = [
  'Actividades Físicas y Deportivas',
  'Administración y Gestión',
  'Agraria',
  'Artes Gráficas',
  'Comercio y Marketing',
  'Edificación y Obra Civil',
  'Electricidad y Electrónica',
  'Energía y Agua',
  'Fabricación Mecánica',
  'Hostelería y Turismo',
  'Imagen Personal',
  'Imagen y Sonido',
  'Industrias Alimentarias',
  'Informática y Comunicaciones',
  'Instalación y Mantenimiento',
  'Madera, Mueble y Corcho',
  'Marítimo-Pesquera',
  'Química',
  'Sanidad',
  'Seguridad y Medio Ambiente',
  'Servicios Socioculturales y a la Comunidad',
  'Textil, Confección y Piel',
  'Transporte y Mantenimiento de Vehículos',
  'FOL',
  'Idiomas'
];

const OBJECTIVES = [
  'Impulsar la creación de una cultura innovadora.',
  'Implementar un plan de gestión de la innovación en los centros.',
  'Incorporar las nuevas tecnologías y metodologías de enseñanza para favorecer la innovación curricular.',
  'Realización de proyectos de innovación.',
  'Identificar y desarrollar el talento interno.',
  'Identificar y desarrollar el talento externo (Innovación abierta)',
  'Explorar e integrar las TIC en los procesos de enseñanza-aprendizaje y en la organización del centro.'
];

const InnovationActionForm: React.FC<InnovationActionFormProps> = ({ onSubmit, onCancel }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [formData, setFormData] = useState({
    // Sección 2: Datos Identificativos
    managerName: '',
    email: '',
    educationalCenter: '',
    centerCode: '',
    network: '',

    // Sección 3: Acción
    actionBy: 'center', // 'center' o 'network'
    quarter: '',
    academicYear: '2024/25',
    actionTitle: '',
    actionDescription: '',
    objective: '',
    startDate: '',
    endDate: '',
    teachersInvolved: 0,
    studentsInvolved: 0,
    images: [] as File[],
    collaboratingDepartments: [] as string[],
    assessment: '',
    satisfactionLevel: 3
  });

  const handleSubmit = (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    onSubmit(formData, isDraft);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Datos Identificativos</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre y apellidos del gestor/a o coordinador/a *
                </label>
                <input
                  type="text"
                  required
                  value={formData.managerName}
                  onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del centro educativo *
                </label>
                <select
                  required
                  value={formData.educationalCenter}
                  onChange={(e) => setFormData({ ...formData, educationalCenter: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccionar centro</option>
                  {CENTERS.map((center) => (
                    <option key={center} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Código del centro *
                </label>
                <input
                  type="text"
                  required
                  value={formData.centerCode}
                  onChange={(e) => setFormData({ ...formData, centerCode: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pertenece a la red *
                </label>
                <select
                  required
                  value={formData.network}
                  onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccionar red</option>
                  {NETWORKS.map((network) => (
                    <option key={network} value={network}>
                      {network}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Acción</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Acción realizada por *
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="center"
                      checked={formData.actionBy === 'center'}
                      onChange={(e) => setFormData({ ...formData, actionBy: e.target.value })}
                      className="form-radio"
                    />
                    <span className="ml-2">El centro</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="network"
                      checked={formData.actionBy === 'network'}
                      onChange={(e) => setFormData({ ...formData, actionBy: e.target.value })}
                      className="form-radio"
                    />
                    <span className="ml-2">La red</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trimestre *
                </label>
                <select
                  required
                  value={formData.quarter}
                  onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccionar trimestre</option>
                  <option value="1">Primer trimestre</option>
                  <option value="2">Segundo trimestre</option>
                  <option value="3">Tercer trimestre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título de la acción *
                </label>
                <input
                  type="text"
                  required
                  value={formData.actionTitle}
                  onChange={(e) => setFormData({ ...formData, actionTitle: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Breve descripción de la acción *
                </label>
                <TextareaAutosize
                  required
                  minRows={3}
                  value={formData.actionDescription}
                  onChange={(e) => setFormData({ ...formData, actionDescription: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Objetivo que desarrolla la acción *
                </label>
                <select
                  required
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seleccionar objetivo</option>
                  {OBJECTIVES.map((objective) => (
                    <option key={objective} value={objective}>
                      {objective}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de inicio *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de fin *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nº profesores/as implicados *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.teachersInvolved}
                    onChange={(e) => setFormData({ ...formData, teachersInvolved: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Número de alumnos y alumnas implicados *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.studentsInvolved}
                    onChange={(e) => setFormData({ ...formData, studentsInvolved: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Departamentos colaboradores
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {DEPARTMENTS.map((department) => (
                    <label key={department} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.collaboratingDepartments.includes(department)}
                        onChange={(e) => {
                          const departments = e.target.checked
                            ? [...formData.collaboratingDepartments, department]
                            : formData.collaboratingDepartments.filter(d => d !== department);
                          setFormData({ ...formData, collaboratingDepartments: departments });
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{department}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Breve valoración de la acción *
                </label>
                <TextareaAutosize
                  required
                  minRows={3}
                  value={formData.assessment}
                  onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Grado de satisfacción con la ejecución de la acción desarrollada *
                </label>
                <div className="mt-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.satisfactionLevel}
                    onChange={(e) => setFormData({ ...formData, satisfactionLevel: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Nada satisfecho</span>
                    <span>Muy satisfecho</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {renderSection()}
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          {currentSection > 1 && (
            <button
              type="button"
              onClick={() => setCurrentSection(currentSection - 1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Anterior
            </button>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar borrador
          </button>
          {currentSection < 2 ? (
            <button
              type="button"
              onClick={() => setCurrentSection(currentSection + 1)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default InnovationActionForm;