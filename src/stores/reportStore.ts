import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Report } from '../types/report';

interface ReportState {
  reports: Report[];
  addReport: (report: Report) => void;
  updateReport: (report: Report) => void;
  deleteReport: (id: string) => void;
  getReportsByUser: (userId: string) => Report[];
  getReportsByRole: (role: string) => Report[];
  getReportsBySubnet: (subnetId: string) => Report[];
}

export const useReportStore = create<ReportState>()(
  persist(
    (set, get) => ({
      reports: [],

      addReport: (report) => {
        set((state) => ({
          reports: [...state.reports, report],
        }));
      },

      updateReport: (updatedReport) =>
        set((state) => ({
          reports: state.reports.map((report) =>
            report.id === updatedReport.id ? updatedReport : report
          ),
        })),

      deleteReport: (id) =>
        set((state) => ({
          reports: state.reports.filter((report) => report.id !== id),
        })),

      getReportsByUser: (userId) => {
        const { reports } = get();
        return reports.filter(
          (report) =>
            report.createdBy === userId ||
            report.permissions.users.includes(userId)
        );
      },

      getReportsByRole: (role) => {
        const { reports } = get();
        return reports.filter((report) =>
          report.permissions.roles.includes(role)
        );
      },

      getReportsBySubnet: (subnetId) => {
        const { reports } = get();
        return reports.filter((report) =>
          report.permissions.subnets.includes(subnetId)
        );
      },
    }),
    {
      name: 'report-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Convert old report format to new format if needed
          return {
            ...persistedState,
            reports: persistedState.reports.map((report: any) => ({
              ...report,
              permissions: report.permissions || {
                users: [],
                subnets: [],
                roles: []
              }
            }))
          };
        }
        return persistedState;
      },
    }
  )
);