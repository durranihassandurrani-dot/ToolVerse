import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PageSlug, Tool } from '@/types';

interface AppState {
  currentPage: PageSlug;
  currentTool: Tool | null;
  currentBlogSlug: string | null;
  currentCategorySlug: string | null;
  searchQuery: string;
  favorites: string[];
  recentTools: string[];
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  navigate: (page: PageSlug, tool?: Tool | null, blogSlug?: string, categorySlug?: string) => void;
  setSearchQuery: (q: string) => void;
  toggleFavorite: (toolId: string) => void;
  addRecent: (toolId: string) => void;
  setIsSearchOpen: (v: boolean) => void;
  setIsMobileMenuOpen: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: 'home',
      currentTool: null,
      currentBlogSlug: null,
      currentCategorySlug: null,
      searchQuery: '',
      favorites: [],
      recentTools: [],
      isSearchOpen: false,
      isMobileMenuOpen: false,
      navigate: (page, tool = null, blogSlug = null, categorySlug = null) => {
        const state = get();
        let updatedRecent = [...state.recentTools];
        if (tool) {
          updatedRecent = [tool.id, ...updatedRecent.filter(id => id !== tool.id)].slice(0, 20);
        }
        set({
          currentPage: page,
          currentTool: tool,
          currentBlogSlug: blogSlug,
          currentCategorySlug: categorySlug,
          isMobileMenuOpen: false,
          isSearchOpen: false,
          recentTools: updatedRecent,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      setSearchQuery: (q) => set({ searchQuery: q }),
      toggleFavorite: (toolId) => {
        const favs = get().favorites;
        set({ favorites: favs.includes(toolId) ? favs.filter(id => id !== toolId) : [...favs, toolId] });
      },
      addRecent: (toolId) => {
        const recents = get().recentTools;
        set({ recentTools: [toolId, ...recents.filter(id => id !== toolId)].slice(0, 20) });
      },
      setIsSearchOpen: (v) => set({ isSearchOpen: v }),
      setIsMobileMenuOpen: (v) => set({ isMobileMenuOpen: v }),
    }),
    { name: 'toolverse-store', partialize: (state) => ({ favorites: state.favorites, recentTools: state.recentTools }) }
  )
);