import React, { useState } from 'react';
import { X, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { DashboardWidget, ChartType } from '../../types/dashboard';
import { useFormStore } from '../../stores/formStore';

interface DashboardWidgetSettingsProps {
  widget: DashboardWidget;
  onUpdate: (updates: Partial<DashboardWidget>) => void;
  onClose: () => void;
}

const DashboardWidgetSettings: React.FC<DashboardWidgetSettingsProps> = ({
  widget,
  onUpdate,
  onClose,
}) => {
  const { forms } = useFormStore();
  const [activeTab, setActiveTab] = useState<'general' | 'data' | 'style' | 'content'>('general');

  const handleContentUpdate = (content: string) => {
    onUpdate({
      config: {
        ...widget.config,
        content,
      },
    });
  };

  const handleLinkAdd = () => {
    const links = widget.config.links || [];
    onUpdate({
      config: {
        ...widget.config,
        links: [...links, { text: '', url: '', color: '#3b82f6' }],
      },
    });
  };

  const handleLinkUpdate = (index: number, updates: Partial<{ text: string; url: string; color: string }>) => {
    const links = [...(widget.config.links || [])];
    links[index] = { ...links[index], ...updates };
    onUpdate({
      config: {
        ...widget.config,
        links,
      },
    });
  };

  const handleLinkRemove = (index: number) => {
    const links = widget.config.links?.filter((_, i) => i !== index);
    onUpdate({
      config: {
        ...widget.config,
        links,
      },
    });
  };

  const renderContentTab = () => {
    if (widget.type === 'text') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Contenido</label>
            <textarea
              value={widget.config.content || ''}
              onChange={(e) => handleContentUpdate(e.target.value)}
              rows={6}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Alineación</label>
              <select
                value={widget.config.textAlign || 'left'}
                onChange={(e) => onUpdate({
                  config: { ...widget.config, textAlign: e.target.value as 'left' | 'center' | 'right' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="left">Izquierda</option>
                <option value="center">Centro</option>
                <option value="right">Derecha</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tamaño de fuente</label>
              <select
                value={widget.config.fontSize || 'medium'}
                onChange={(e) => onUpdate({
                  config: { ...widget.config, fontSize: e.target.value as 'small' | 'medium' | 'large' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="small">Pequeño</option>
                <option value="medium">Mediano</option>
                <option value="large">Grande</option>
              </select>
            </div>
          </div>
        </div>
      );
    }

    if (widget.type === 'link') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700">Enlaces</h4>
            <button
              onClick={handleLinkAdd}
              className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir Enlace
            </button>
          </div>
          <div className="space-y-4">
            {widget.config.links?.map((link, index) => (
              <div key={index} className="flex items-start space-x-2 bg-gray-50 p-3 rounded-md">
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Texto</label>
                    <input
                      type="text"
                      value={link.text}
                      onChange={(e) => handleLinkUpdate(index, { text: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">URL</label>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => handleLinkUpdate(index, { url: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Color</label>
                    <input
                      type="color"
                      value={link.color}
                      onChange={(e) => handleLinkUpdate(index, { color: e.target.value })}
                      className="mt-1 h-9 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleLinkRemove(index)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Configuración del Widget</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'general'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              General
            </button>
            {(widget.type === 'text' || widget.type === 'link') && (
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === 'content'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Contenido
              </button>
            )}
            <button
              onClick={() => setActiveTab('style')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'style'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Estilo
            </button>
          </nav>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  value={widget.title}
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ancho</label>
                  <select
                    value={widget.width}
                    onChange={(e) => onUpdate({ width: Number(e.target.value) as 1 | 2 | 3 | 4 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={1}>1 columna</option>
                    <option value={2}>2 columnas</option>
                    <option value={3}>3 columnas</option>
                    <option value={4}>4 columnas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alto</label>
                  <select
                    value={widget.height}
                    onChange={(e) => onUpdate({ height: Number(e.target.value) as 1 | 2 | 3 })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value={1}>1 fila</option>
                    <option value={2}>2 filas</option>
                    <option value={3}>3 filas</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && renderContentTab()}

          {activeTab === 'style' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Color de fondo</label>
                <input
                  type="color"
                  value={widget.config.backgroundColor || '#ffffff'}
                  onChange={(e) => onUpdate({
                    config: { ...widget.config, backgroundColor: e.target.value }
                  })}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300"
                />
              </div>

              {widget.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Color del texto</label>
                  <input
                    type="color"
                    value={widget.config.textColor || '#000000'}
                    onChange={(e) => onUpdate({
                      config: { ...widget.config, textColor: e.target.value }
                    })}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Radio del borde</label>
                <select
                  value={widget.config.borderRadius || '0.375rem'}
                  onChange={(e) => onUpdate({
                    config: { ...widget.config, borderRadius: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="0">Sin borde</option>
                  <option value="0.375rem">Pequeño</option>
                  <option value="0.5rem">Mediano</option>
                  <option value="1rem">Grande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Relleno interno</label>
                <select
                  value={widget.config.padding || '1rem'}
                  onChange={(e) => onUpdate({
                    config: { ...widget.config, padding: e.target.value }
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="0.5rem">Pequeño</option>
                  <option value="1rem">Mediano</option>
                  <option value="1.5rem">Grande</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardWidgetSettings;