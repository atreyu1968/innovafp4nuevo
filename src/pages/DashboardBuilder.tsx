import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Save, Layout, Settings, Search } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Dashboard, DashboardWidget } from '../types/dashboard';
import { useFormStore } from '../stores/formStore';
import { useAuthStore } from '../stores/authStore';
import { useDashboardStore } from '../stores/dashboardStore';
import DashboardWidgetBuilder from '../components/dashboards/DashboardWidgetBuilder';
import DashboardPermissions from '../components/dashboards/DashboardPermissions';
import { useNotifications } from '../components/notifications/NotificationProvider';

const DashboardBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotifications();
  const { dashboards, addDashboard, updateDashboard } = useDashboardStore();
  const { user } = useAuthStore();
  const { forms } = useFormStore();

  const [dashboard, setDashboard] = useState<Partial<Dashboard>>({
    title: '',
    description: '',
    widgets: [],
    permissions: {
      roles: [],
      users: []
    },
    createdBy: user?.id || '',
    academicYearId: '',
  });

  const [showPermissions, setShowPermissions] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (id) {
      const existingDashboard = dashboards.find(d => d.id === id);
      if (existingDashboard) {
        setDashboard(existingDashboard);
      }
    }
  }, [id, dashboards]);

  const handleAddWidget = (type: DashboardWidget['type']) => {
    const newWidget: DashboardWidget = {
      id: crypto.randomUUID(),
      type,
      title: 'Nuevo Widget',
      width: type === 'pivot' ? 4 : 1,
      height: type === 'pivot' ? 2 : 1,
      position: dashboard.widgets?.length || 0,
      config: {
        formIds: [],
        fields: [],
        filters: [],
      },
    };

    setDashboard(prev => ({
      ...prev,
      widgets: [...(prev.widgets || []), newWidget],
    }));
  };

  const handleUpdateWidget = (widgetId: string, updates: Partial<DashboardWidget>) => {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets?.map(w => w.id === widgetId ? { ...w, ...updates } : w),
    }));
  };

  const handleDeleteWidget = (widgetId: string) => {
    setDashboard(prev => ({
      ...prev,
      widgets: prev.widgets?.filter(w => w.id !== widgetId),
    }));
  };

  const handleSave = () => {
    if (!dashboard.title) {
      showNotification('error', 'El dashboard debe tener un título');
      return;
    }

    try {
      if (id) {
        updateDashboard(dashboard as Dashboard);
        showNotification('success', 'Dashboard actualizado correctamente');
      } else {
        const newDashboard: Dashboard = {
          ...dashboard as Dashboard,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addDashboard(newDashboard);
        showNotification('success', 'Dashboard creado correctamente');
      }
      navigate('/dashboards');
    } catch (error) {
      showNotification('error', 'Error al guardar el dashboard');
    }
  };

  const filteredForms = forms.filter(form =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={dashboard.title}
            onChange={(e) => setDashboard({ ...dashboard, title: e.target.value })}
            placeholder="Título del Dashboard"
            className="text-2xl font-bold bg-transparent border-none focus:ring-0 p-0 w-full"
          />
          <input
            type="text"
            value={dashboard.description || ''}
            onChange={(e) => setDashboard({ ...dashboard, description: e.target.value })}
            placeholder="Descripción (opcional)"
            className="text-gray-500 bg-transparent border-none focus:ring-0 p-0 w-full mt-1"
          />
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPermissions(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Permisos
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Guardar
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-4 overflow-hidden">
        <div className="col-span-3 bg-gray-50 rounded-lg p-4 overflow-auto">
          <DndContext collisionDetection={closestCenter}>
            <SortableContext items={dashboard.widgets || []} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-4 gap-4 auto-rows-min">
                {dashboard.widgets?.map((widget) => (
                  <DashboardWidgetBuilder
                    key={widget.id}
                    widget={widget}
                    onUpdate={(updates) => handleUpdateWidget(widget.id, updates)}
                    onDelete={() => handleDeleteWidget(widget.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {(!dashboard.widgets || dashboard.widgets.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Layout className="h-12 w-12 mb-4" />
              <p className="text-lg">Arrastra widgets aquí para comenzar</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium mb-4">Widgets Disponibles</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'table', label: 'Tabla' },
                { type: 'chart', label: 'Gráfico' },
                { type: 'pivot', label: 'Tabla Dinámica' },
                { type: 'card', label: 'Tarjeta' },
                { type: 'kpi', label: 'KPI' },
                { type: 'filter', label: 'Filtro' },
              ].map((widget) => (
                <button
                  key={widget.type}
                  onClick={() => handleAddWidget(widget.type as DashboardWidget['type'])}
                  className="p-4 border rounded text-center hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Layout className="h-5 w-5 mx-auto mb-1" />
                  {widget.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Orígenes de Datos</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filteredForms.map((form) => (
                <div
                  key={form.id}
                  className="p-2 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  <h4 className="font-medium text-sm">{form.title}</h4>
                  {form.description && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {form.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPermissions && (
        <DashboardPermissions
          permissions={dashboard.permissions}
          onUpdate={(permissions) => setDashboard({ ...dashboard, permissions })}
          onClose={() => setShowPermissions(false)}
        />
      )}
    </div>
  );
};

export default DashboardBuilder;