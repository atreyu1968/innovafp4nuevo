import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Subnet, EducationalCenter, Island, ProfessionalFamily, CenterType } from '../types/network';

export const ISLANDS: Island[] = [
  'Tenerife',
  'Gran Canaria',
  'Lanzarote',
  'La Palma',
  'La Gomera',
  'El Hierro',
  'Fuerteventura'
];

interface NetworkState {
  subnets: Subnet[];
  centers: EducationalCenter[];
  families: ProfessionalFamily[];
  centerTypes: CenterType[];
  addSubnet: (subnet: Subnet) => void;
  updateSubnet: (subnet: Subnet) => void;
  deleteSubnet: (subnetId: string) => void;
  addCenter: (center: EducationalCenter) => void;
  updateCenter: (center: EducationalCenter) => void;
  deleteCenter: (centerId: string) => void;
  addFamily: (family: ProfessionalFamily) => void;
  updateFamily: (family: ProfessionalFamily) => void;
  deleteFamily: (familyId: string) => void;
  addCenterType: (type: CenterType) => void;
  updateCenterType: (type: CenterType) => void;
  deleteCenterType: (typeId: string) => void;
  getCIFPs: () => EducationalCenter[];
  getSubnetsByIsland: (island: Island) => Subnet[];
  getCentersBySubnet: (subnetId: string) => EducationalCenter[];
  getFamiliesByYear: (yearId: string) => ProfessionalFamily[];
  getCenterTypesByYear: (yearId: string) => CenterType[];
  getCenterType: (typeId: string) => CenterType | undefined;
  importSubnetsFromCSV: (file: File) => Promise<{ success: boolean; message: string }>;
  importCentersFromCSV: (file: File) => Promise<{ success: boolean; message: string }>;
  importFamiliesFromCSV: (file: File) => Promise<{ success: boolean; message: string }>;
  importCenterTypesFromCSV: (file: File) => Promise<{ success: boolean; message: string }>;
  importSubnetsFromYear: (fromYearId: string, toYearId: string) => void;
  importCentersFromYear: (fromYearId: string, toYearId: string) => void;
  importFamiliesFromYear: (fromYearId: string, toYearId: string) => void;
  importCenterTypesFromYear: (fromYearId: string, toYearId: string) => void;
  removeDuplicates: () => { subnets: number; centers: number; families: number; centerTypes: number };
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set, get) => ({
      subnets: [],
      centers: [],
      families: [],
      centerTypes: [
        {
          id: '1',
          code: 'CIFP',
          name: 'Centro Integrado de Formación Profesional',
          academicYearId: '1',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          code: 'IES',
          name: 'Instituto de Educación Secundaria',
          academicYearId: '1',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ],

      addSubnet: (subnet) => set((state) => ({
        subnets: [...state.subnets, subnet]
      })),

      updateSubnet: (updatedSubnet) => set((state) => ({
        subnets: state.subnets.map(subnet =>
          subnet.id === updatedSubnet.id ? updatedSubnet : subnet
        )
      })),

      deleteSubnet: (subnetId) => set((state) => ({
        subnets: state.subnets.filter(subnet => subnet.id !== subnetId)
      })),

      addCenter: (center) => set((state) => ({
        centers: [...state.centers, center]
      })),

      updateCenter: (updatedCenter) => set((state) => ({
        centers: state.centers.map(center =>
          center.id === updatedCenter.id ? updatedCenter : center
        )
      })),

      deleteCenter: (centerId) => set((state) => ({
        centers: state.centers.filter(center => center.id !== centerId)
      })),

      addFamily: (family) => set((state) => ({
        families: [...state.families, family]
      })),

      updateFamily: (updatedFamily) => set((state) => ({
        families: state.families.map(family =>
          family.id === updatedFamily.id ? updatedFamily : family
        )
      })),

      deleteFamily: (familyId) => set((state) => ({
        families: state.families.filter(family => family.id !== familyId)
      })),

      addCenterType: (type) => set((state) => ({
        centerTypes: [...state.centerTypes, type]
      })),

      updateCenterType: (updatedType) => set((state) => ({
        centerTypes: state.centerTypes.map(type =>
          type.id === updatedType.id ? updatedType : type
        )
      })),

      deleteCenterType: (typeId) => set((state) => ({
        centerTypes: state.centerTypes.filter(type => type.id !== typeId)
      })),

      getCIFPs: () => {
        const { centers, centerTypes } = get();
        const cifpType = centerTypes.find(type => type.code === 'CIFP');
        return centers.filter(center => center.typeId === cifpType?.id);
      },

      getSubnetsByIsland: (island) => {
        const { subnets } = get();
        return subnets.filter(subnet => subnet.island === island);
      },

      getCentersBySubnet: (subnetId) => {
        const { centers } = get();
        return centers.filter(center => center.subnetId === subnetId);
      },

      getFamiliesByYear: (yearId) => {
        const { families } = get();
        return families.filter(family => family.academicYearId === yearId);
      },

      getCenterTypesByYear: (yearId) => {
        const { centerTypes } = get();
        return centerTypes.filter(type => type.academicYearId === yearId);
      },

      getCenterType: (typeId) => {
        const { centerTypes } = get();
        return centerTypes.find(type => type.id === typeId);
      },

      // Import methods implementation...
      // (Keep the existing implementation for these methods)

      removeDuplicates: () => {
        const state = get();
        const counts = {
          subnets: 0,
          centers: 0,
          families: 0,
          centerTypes: 0
        };

        // Remove duplicates logic...
        // (Keep the existing implementation)

        return counts;
      }
    }),
    {
      name: 'network-storage',
    }
  )
);