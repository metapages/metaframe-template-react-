import { create } from 'zustand';

import { isSearchParamTruthy } from './util/url';

interface MetaframeStore {
  editMode: boolean;
  setEditMode: (editMode?: boolean) => void;

  tab: number;
  setTab: (tab: number) => void;
}

export const useStore = create<MetaframeStore>((set) => ({
  editMode: !isSearchParamTruthy(
    new URLSearchParams(window.location.search).get("edit")
  ),
  setEditMode: (editMode?: boolean) => set((state) => ({ editMode })),

  tab: 0,
  setTab: (tab: number) => set((state) => ({ tab })),
}));
