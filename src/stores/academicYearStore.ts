import { create } from 'zustand';
import { AcademicYear } from '../types/academicYear';

interface AcademicYearState {
  years: AcademicYear[];
  activeYear: AcademicYear | null;
  setYears: (years: AcademicYear[]) => void;
  addYear: (year: AcademicYear) => void;
  updateYear: (year: AcademicYear) => void;
  getActiveYear: () => AcademicYear | null;
}

// Datos de ejemplo
const mockYears: AcademicYear[] = [
  {
    id: '1',
    year: '2023-2024',
    startDate: '2023-09-01',
    endDate: '2024-06-30',
    status: 'active',
    description: 'Curso académico actual',
  },
  {
    id: '2',
    year: '2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-06-30',
    status: 'pending',
    description: 'Próximo curso académico',
  },
];

export const useAcademicYearStore = create<AcademicYearState>((set, get) => ({
  years: mockYears,
  activeYear: mockYears.find(y => y.status === 'active') || null,
  
  setYears: (years) => set({ years }),
  
  addYear: (year) => set((state) => ({ 
    years: [...state.years, year] 
  })),
  
  updateYear: (updatedYear) => set((state) => ({
    years: state.years.map(year => 
      year.id === updatedYear.id ? updatedYear : year
    ),
    activeYear: updatedYear.status === 'active' ? updatedYear : 
      (state.activeYear?.id === updatedYear.id ? null : state.activeYear)
  })),
  
  getActiveYear: () => get().activeYear,
}));