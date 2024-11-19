import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Form, FormResponse } from '../types/form';
import { useAuthStore } from './authStore';
import { useAcademicYearStore } from './academicYearStore';
import { generateReport } from '../utils/reportGenerator';

interface FormState {
  forms: Form[];
  responses: FormResponse[];
  reportTemplates: {
    formId: string;
    file: Blob;
    fields: string[];
    mappings: Record<string, string>;
    autoGenerate: boolean;
  }[];
  setForms: (forms: Form[]) => void;
  addForm: (form: Form) => void;
  updateForm: (form: Form) => void;
  deleteForm: (formId: string) => void;
  addResponse: (response: FormResponse) => void;
  updateResponse: (response: FormResponse) => void;
  getFormsByRole: (role: string) => Form[];
  getResponsesByForm: (formId: string) => FormResponse[];
  getResponsesByUser: (userId: string, formId: string) => FormResponse[];
  getResponseByUserAndForm: (userId: string, formId: string) => FormResponse | undefined;
  canUserRespond: (userId: string, formId: string) => boolean;
  syncResponses: () => void;
  setReportTemplate: (formId: string, template: {
    file: Blob;
    fields: string[];
    mappings: Record<string, string>;
    autoGenerate: boolean;
  }) => void;
  getReportTemplate: (formId: string) => {
    file: Blob;
    fields: string[];
    mappings: Record<string, string>;
    autoGenerate: boolean;
  } | undefined;
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      forms: [],
      responses: [],
      reportTemplates: [],

      setForms: (forms) => set({ forms }),

      addForm: (form) => {
        const { user } = useAuthStore.getState();
        const formWithUser = {
          ...form,
          createdBy: user?.id,
          createdByName: user?.nombre,
        };
        set((state) => ({
          forms: [...state.forms, formWithUser],
        }));
        get().syncResponses();
      },

      updateForm: (updatedForm) => set((state) => ({
        forms: state.forms.map((form) =>
          form.id === updatedForm.id ? updatedForm : form
        ),
      })),

      deleteForm: (formId) => set((state) => ({
        forms: state.forms.filter((form) => form.id !== formId),
        responses: state.responses.filter((response) => response.formId !== formId),
        reportTemplates: state.reportTemplates.filter((template) => template.formId !== formId),
      })),

      addResponse: async (response) => {
        set((state) => ({
          responses: [...state.responses, response],
        }));

        // Si hay una plantilla de informe configurada y está activada la generación automática
        const template = get().reportTemplates.find(t => t.formId === response.formId);
        if (template?.autoGenerate) {
          await generateReport({
            response,
            template: template.file,
            fields: template.fields,
            mappings: template.mappings,
          });
        }
      },

      updateResponse: async (updatedResponse) => {
        set((state) => ({
          responses: state.responses.map((response) =>
            response.id === updatedResponse.id ? updatedResponse : response
          ),
        }));

        // Regenerar informe si existe y está configurado como automático
        const template = get().reportTemplates.find(t => t.formId === updatedResponse.formId);
        if (template?.autoGenerate) {
          await generateReport({
            response: updatedResponse,
            template: template.file,
            fields: template.fields,
            mappings: template.mappings,
          });
        }
      },

      getFormsByRole: (role) => {
        const { forms } = get();
        const { activeYear } = useAcademicYearStore.getState();
        return forms.filter(
          (form) =>
            form.status === 'publicado' && 
            form.assignedRoles.includes(role) &&
            form.academicYearId === activeYear?.id
        );
      },

      getResponsesByForm: (formId) => {
        const { responses } = get();
        return responses.filter((response) => response.formId === formId);
      },

      getResponsesByUser: (userId, formId) => {
        const { responses } = get();
        return responses.filter(
          (response) => response.userId === userId && response.formId === formId
        );
      },

      getResponseByUserAndForm: (userId, formId) => {
        const { responses } = get();
        return responses.find(
          (response) => response.userId === userId && response.formId === formId
        );
      },

      canUserRespond: (userId, formId) => {
        const form = get().forms.find(f => f.id === formId);
        if (!form || form.status !== 'publicado' || !form.acceptingResponses) {
          return false;
        }

        const userResponses = get().getResponsesByUser(userId, formId);
        if (!form.allowMultipleResponses && userResponses.length > 0) {
          return false;
        }

        return true;
      },

      syncResponses: () => {
        const { forms, responses } = get();
        const { user } = useAuthStore.getState();
        const { activeYear } = useAcademicYearStore.getState();

        if (!user || !activeYear) return;

        const userForms = forms.filter(
          form => 
            form.status === 'publicado' &&
            form.assignedRoles.includes(user.role) &&
            form.academicYearId === activeYear.id
        );

        const newResponses = userForms
          .filter(form => !responses.some(r => r.formId === form.id && r.userId === user.id))
          .map(form => ({
            id: crypto.randomUUID(),
            formId: form.id,
            userId: user.id,
            userName: user.nombre,
            userRole: user.role,
            academicYearId: activeYear.id,
            responses: {},
            status: 'borrador',
            responseTimestamp: new Date().toISOString(),
            lastModifiedTimestamp: new Date().toISOString(),
          }));

        if (newResponses.length > 0) {
          set(state => ({
            responses: [...state.responses, ...newResponses]
          }));
        }
      },

      setReportTemplate: (formId, template) => {
        set((state) => ({
          reportTemplates: [
            ...state.reportTemplates.filter(t => t.formId !== formId),
            { formId, ...template }
          ]
        }));
      },

      getReportTemplate: (formId) => {
        return get().reportTemplates.find(t => t.formId === formId);
      },
    }),
    {
      name: 'form-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Add reportTemplates array if it doesn't exist
          return {
            ...persistedState,
            reportTemplates: [],
          };
        }
        return persistedState;
      },
    }
  )
);