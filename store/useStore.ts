import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface List {
  id: string;
  name: string;
  companyIds: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: {
    query: string;
    sector: string;
    stage: string;
    location: string;
  };
}

interface AppState {
  lists: List[];
  savedSearches: SavedSearch[];
  notes: Record<string, string>;
  addList: (name: string) => void;
  removeList: (id: string) => void;
  addCompanyToList: (listId: string, companyId: string) => void;
  removeCompanyFromList: (listId: string, companyId: string) => void;
  saveSearch: (name: string, filters: SavedSearch['filters']) => void;
  deleteSearch: (id: string) => void;
  saveNote: (companyId: string, note: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      lists: [],
      savedSearches: [],
      notes: {},
      addList: (name) =>
        set((state) => ({
          lists: [...state.lists, { id: Date.now().toString(), name, companyIds: [] }],
        })),
      removeList: (id) =>
        set((state) => ({
          lists: state.lists.filter((l) => l.id !== id),
        })),
      addCompanyToList: (listId, companyId) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId
              ? { ...l, companyIds: Array.from(new Set([...l.companyIds, companyId])) }
              : l
          ),
        })),
      removeCompanyFromList: (listId, companyId) =>
        set((state) => ({
          lists: state.lists.map((l) =>
            l.id === listId
              ? { ...l, companyIds: l.companyIds.filter((id) => id !== companyId) }
              : l
          ),
        })),
      saveSearch: (name, filters) =>
        set((state) => ({
          savedSearches: [
            ...state.savedSearches,
            { id: Date.now().toString(), name, filters },
          ],
        })),
      deleteSearch: (id) =>
        set((state) => ({
          savedSearches: state.savedSearches.filter((s) => s.id !== id),
        })),
      saveNote: (companyId, note) =>
        set((state) => ({
          notes: { ...state.notes, [companyId]: note },
        })),
    }),
    {
      name: 'vc-scout-storage',
    }
  )
);
