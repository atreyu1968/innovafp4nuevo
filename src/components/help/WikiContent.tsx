import React from 'react';
import { UserRole } from '../../types/user';
import { Book, FileText, Users, BarChart3, Settings, Network, BookOpen, Mail, Layout } from 'lucide-react';

interface WikiContentProps {
  role?: UserRole;
  searchQuery: string;
}

const WikiContent: React.FC<WikiContentProps> = ({ role, searchQuery }) => {
  const commonSections = [
    {
      id: 'formularios',
      title: 'Gestión de Formularios',
      content: `
### Creación y Gestión de Formularios

Los formularios son una herramienta fundamental para recopilar información en la Red de Innovación FP.

#### Creación de Formularios

1. **Acceso**: Ve a la sección "Formularios" y haz clic en "Nuevo Formulario"
2. **Configuración básica**:
   - Define el título y descripción
   - Establece fechas de inicio y fin (opcional)
   - Selecciona los roles que podrán acceder al formulario

3. **Tipos de campos disponibles**:
   - Texto corto: Para respuestas breves
   - Texto largo: Para respuestas extensas
   - Selección única: Opciones excluyentes
   - Selección múltiple: Permite varias opciones
   - Fecha: Para registrar fechas
   - Número: Para valores numéricos
   - Desplegable: Lista de opciones predefinidas
   - Archivo: Para subir documentos o imágenes
   - Sección: Para agrupar campos relacionados

4. **Configuración de campos**:
   - Añade una etiqueta descriptiva
   - Marca si es obligatorio
   - Añade una descripción o ayuda
   - Define opciones para campos de selección
   - Establece validaciones específicas
   - Configura reglas condicionales para mostrar/ocultar campos

5. **Importación de plantillas**:
   - Importa formularios desde Word
   - Importa formularios de cursos anteriores
   - Reutiliza estructuras existentes

### Respuesta a Formularios

1. **Acceso**: Los formularios asignados aparecerán en tu panel
2. **Guardado**: Puedes guardar borradores parciales
3. **Envío**: Verifica los campos obligatorios antes de enviar
4. **Historial**: Accede a tus respuestas anteriores
5. **Archivos adjuntos**: Sube documentación complementaria

### Gestión de Respuestas

- Exportación de datos en CSV/Excel
- Visualización de estadísticas
- Seguimiento de completitud
- Análisis de respuestas en tiempo real
`,
    },
    {
      id: 'dashboards',
      title: 'Dashboards y Visualizaciones',
      content: `
### Gestión de Dashboards

Los dashboards permiten visualizar y analizar datos de forma interactiva.

#### Tipos de Widgets

1. **Tablas**:
   - Muestra datos en formato tabular
   - Ordena y filtra información
   - Exporta datos a CSV/Excel

2. **Gráficos**:
   - Gráficos de barras
   - Gráficos de líneas
   - Gráficos circulares
   - Gráficos de área
   - Personalización de colores y estilos

3. **Tablas Dinámicas**:
   - Análisis multidimensional
   - Agrupación y resumen de datos
   - Filtros interactivos

4. **Tarjetas y KPIs**:
   - Indicadores clave
   - Métricas importantes
   - Comparativas

5. **Texto y Enlaces**:
   - Contenido estático
   - Enlaces a recursos externos
   - Personalización de estilos

#### Configuración

1. **Diseño**:
   - Disposición flexible de widgets
   - Tamaños personalizables
   - Diseño responsive

2. **Fuentes de Datos**:
   - Formularios
   - Respuestas
   - Datos del sistema

3. **Permisos**:
   - Asignación por roles
   - Asignación por usuarios
   - Control de visibilidad

4. **Importación/Exportación**:
   - Importar desde otros cursos
   - Exportar configuraciones
   - Reutilizar diseños
`,
    },
    {
      id: 'mensajes',
      title: 'Sistema de Mensajería',
      content: `
### Comunicación Interna

El sistema de mensajería permite la comunicación efectiva entre usuarios.

#### Funcionalidades

1. **Mensajes Directos**:
   - Envío de mensajes individuales
   - Historial de conversaciones
   - Notificaciones de nuevos mensajes

2. **Contacto**:
   - Envío de correos electrónicos
   - Llamadas telefónicas directas
   - Gestión de contactos

3. **Organización**:
   - Búsqueda de conversaciones
   - Filtrado por usuarios
   - Ordenación cronológica

4. **Gestión**:
   - Marcar como leído/no leído
   - Eliminar mensajes
   - Archivado de conversaciones
`,
    },
    {
      id: 'red',
      title: 'Gestión de Red',
      content: `
### Estructura de la Red

La red se organiza en diferentes niveles y componentes.

#### Componentes

1. **Subredes**:
   - Creación y gestión
   - Asignación de centros
   - Coordinación por isla

2. **Centros Educativos**:
   - CIFP y IES
   - Datos de contacto
   - Asignación a subredes

3. **Familias Profesionales**:
   - Gestión de especialidades
   - Asignación a centros
   - Coordinación específica

#### Gestión

1. **Importación**:
   - Importar desde CSV
   - Importar de cursos anteriores
   - Validación de datos

2. **Mantenimiento**:
   - Eliminación de duplicados
   - Actualización de datos
   - Control de versiones

3. **Organización**:
   - Filtrado por isla
   - Búsqueda avanzada
   - Gestión de permisos
`,
    },
    {
      id: 'usuarios',
      title: 'Gestión de Usuarios',
      content: `
### Administración de Usuarios

Sistema completo para la gestión de usuarios y permisos.

#### Roles y Permisos

1. **Tipos de Usuarios**:
   - Gestor: Gestión a nivel de centro
   - Coordinador de Subred: Gestión de subred
   - Coordinador General: Administración global

2. **Permisos**:
   - Acceso a formularios
   - Gestión de informes
   - Administración de dashboards

#### Funcionalidades

1. **Gestión de Usuarios**:
   - Alta de nuevos usuarios
   - Modificación de datos
   - Baja de usuarios
   - Eliminación de duplicados

2. **Importación**:
   - Importar desde CSV
   - Importar de cursos anteriores
   - Validación de datos

3. **Comunicación**:
   - Envío de correos
   - Llamadas directas
   - Mensajería interna

4. **Organización**:
   - Filtrado por rol
   - Filtrado por subred
   - Filtrado por familia profesional
`,
    },
  ];

  const roleSpecificContent = {
    gestor: {
      title: 'Guía del Gestor',
      sections: [
        {
          id: 'inicio',
          title: 'Panel de Control',
          content: `
### Funcionalidades Principales

Como gestor, tienes acceso a:

1. **Gestión de Actividades**:
   - Registro de actividades de innovación
   - Seguimiento de proyectos
   - Documentación de resultados

2. **Formularios Asignados**:
   - Completar formularios activos
   - Guardar borradores
   - Revisar histórico de respuestas

3. **Informes de Centro**:
   - Visualización de estadísticas
   - Exportación de datos
   - Seguimiento de indicadores

4. **Comunicación**:
   - Mensajería interna
   - Contacto con coordinadores
   - Notificaciones importantes
`,
        },
      ],
    },
    coordinador_subred: {
      title: 'Guía del Coordinador de Subred',
      sections: [
        {
          id: 'gestion-subred',
          title: 'Gestión de Subred',
          content: `
### Coordinación de Centros

1. **Supervisión de Actividades**:
   - Monitoreo de centros asignados
   - Revisión de informes
   - Coordinación de iniciativas

2. **Gestión de Datos**:
   - Análisis comparativo
   - Identificación de mejores prácticas
   - Seguimiento de objetivos

3. **Comunicación**:
   - Notificaciones a centros
   - Coordinación de reuniones
   - Difusión de información

4. **Dashboards**:
   - Visualización de datos de la subred
   - Análisis de rendimiento
   - Informes personalizados
`,
        },
      ],
    },
    coordinador_general: {
      title: 'Guía del Coordinador General',
      sections: [
        {
          id: 'administracion',
          title: 'Administración del Sistema',
          content: `
### Gestión Global

1. **Cursos Académicos**:
   - Creación y configuración
   - Asignación de centros
   - Activación/desactivación

2. **Gestión de Red**:
   - Configuración de subredes
   - Asignación de coordinadores
   - Gestión de centros

3. **Usuarios y Permisos**:
   - Alta/baja de usuarios
   - Asignación de roles
   - Gestión de permisos

4. **Configuración**:
   - Personalización de la plataforma
   - Gestión de familias profesionales
   - Ajustes generales

5. **Dashboards**:
   - Creación de visualizaciones
   - Asignación de permisos
   - Análisis global
`,
        },
      ],
    },
  };

  const content = role ? roleSpecificContent[role] : null;
  if (!content) return null;

  const allSections = [...content.sections, ...commonSections];
  const filteredSections = allSections.filter(
    (section) =>
      !searchQuery ||
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <Book className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">
            {content.title}
          </h2>
        </div>
      </div>
      <div className="px-6 py-4">
        {filteredSections.map((section) => (
          <div key={section.id} id={section.id} className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {section.title}
            </h3>
            <div className="prose max-w-none">
              {section.content.split('\n').map((line, index) => {
                if (line.startsWith('###')) {
                  return (
                    <h3 key={index} className="text-lg font-medium text-gray-900 mt-4 mb-2">
                      {line.replace('###', '').trim()}
                    </h3>
                  );
                }
                if (line.startsWith('####')) {
                  return (
                    <h4 key={index} className="text-md font-medium text-gray-800 mt-3 mb-2">
                      {line.replace('####', '').trim()}
                    </h4>
                  );
                }
                if (line.startsWith('-')) {
                  return (
                    <li key={index} className="ml-4">
                      {line.replace('-', '').trim()}
                    </li>
                  );
                }
                if (line.match(/^\d+\./)) {
                  return (
                    <div key={index} className="ml-4 mb-2">
                      {line}
                    </div>
                  );
                }
                return line ? <p key={index} className="mb-2">{line}</p> : null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WikiContent;