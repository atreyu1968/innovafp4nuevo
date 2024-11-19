import { create } from 'zustand';
import { Dashboard, DashboardWidget } from '../types/dashboard';
import { useFormStore } from './formStore';
import { useAuthStore } from './authStore';

interface DashboardState {
  dashboards: Dashboard[];
  addDashboard: (dashboard: Dashboard) => void;
  updateDashboard: (dashboard: Dashboard) => void;
  deleteDashboard: (id: string) => void;
  getDashboardsByUser: (userId: string) => Dashboard[];
  getDashboardsByRole: (role: string) => Dashboard[];
  getDashboardsByMenu: (menuId: string) => Dashboard[];
  getWidgetData: (widget: DashboardWidget) => any[];
  importDashboard: (dashboard: Dashboard, formMapping: Map<string, string>) => Promise<Dashboard>;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  dashboards: [],

  addDashboard: (dashboard) => 
    set((state) => ({ dashboards: [...state.dashboards, dashboard] })),

  updateDashboard: (dashboard) =>
    set((state) => ({
      dashboards: state.dashboards.map((d) => 
        d.id === dashboard.id ? dashboard : d
      ),
    })),

  deleteDashboard: (id) =>
    set((state) => ({
      dashboards: state.dashboards.filter((d) => d.id !== id),
    })),

  getDashboardsByUser: (userId) => {
    const { dashboards } = get();
    return dashboards.filter(
      (d) => d.permissions.users?.includes(userId)
    );
  },

  getDashboardsByRole: (role) => {
    const { dashboards } = get();
    return dashboards.filter(
      (d) => d.permissions.roles?.includes(role as any)
    );
  },

  getDashboardsByMenu: (menuId) => {
    const { dashboards } = get();
    return dashboards
      .filter((d) => d.menuId === menuId)
      .sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0));
  },

  getWidgetData: (widget) => {
    const formStore = useFormStore.getState();
    const responses = widget.config.formIds.flatMap((formId) =>
      formStore.getResponsesByForm(formId)
    );

    // Apply filters
    let filteredData = responses;
    if (widget.config.filters) {
      filteredData = responses.filter((response) => {
        return widget.config.filters!.every((filter) => {
          const value = response.responses[filter.fieldId];
          switch (filter.operator) {
            case 'equals':
              return value === filter.value;
            case 'contains':
              return String(value).includes(String(filter.value));
            case 'greater':
              return value > filter.value;
            case 'less':
              return value < filter.value;
            case 'between':
              return value >= filter.value[0] && value <= filter.value[1];
            case 'in':
              return filter.value.includes(value);
            default:
              return true;
          }
        });
      });
    }

    // Group data if needed
    if (widget.config.groupBy?.length) {
      const grouped = new Map();
      filteredData.forEach((response) => {
        const key = widget.config.groupBy!
          .map((field) => response.responses[field])
          .join('-');
        
        const existing = grouped.get(key) || {
          count: 0,
          ...widget.config.groupBy!.reduce((acc, field) => ({
            ...acc,
            [field]: response.responses[field],
          }), {}),
        };

        existing.count++;
        if (widget.config.fields) {
          widget.config.fields.forEach((field) => {
            if (!widget.config.groupBy!.includes(field)) {
              const value = response.responses[field];
              if (typeof value === 'number') {
                existing[field] = (existing[field] || 0) + value;
              }
            }
          });
        }

        grouped.set(key, existing);
      });

      filteredData = Array.from(grouped.values());
    }

    // Sort data if needed
    if (widget.config.sortBy) {
      filteredData.sort((a, b) => {
        const aValue = a.responses?.[widget.config.sortBy!.field] ?? 
                      a[widget.config.sortBy!.field];
        const bValue = b.responses?.[widget.config.sortBy!.field] ?? 
                      b[widget.config.sortBy!.field];
        return widget.config.sortBy!.order === 'asc'
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
    }

    return filteredData;
  },

  importDashboard: async (dashboard, formMapping) => {
    const newDashboard: Dashboard = {
      ...dashboard,
      id: crypto.randomUUID(),
      widgets: dashboard.widgets.map(widget => ({
        ...widget,
        id: crypto.randomUUID(),
        config: {
          ...widget.config,
          formIds: widget.config.formIds.map(id => formMapping.get(id) || id)
        }
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: useAuthStore.getState().user?.id || '',
    };

    set((state) => ({
      dashboards: [...state.dashboards, newDashboard]
    }));

    return newDashboard;
  },
}));