import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_NAME } from "../constants";
import { zustandStorage } from "./storage";
import { THistory } from "../types";

interface THistoryState {
  history: THistory[];
  add: (history: THistory) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const useHistoryStore = create<THistoryState>()(
  persist(
    (set, _get) => ({
      history: [],
      add: (hist) => set({ ..._get(), history: [hist, ..._get().history] }),
      clear: () => set({ ..._get(), history: [] }),
      remove: (id) => {
        return set({
          ..._get(),
          history: _get().history.filter((h) => h.id !== id),
        });
      },
    }),
    {
      name: STORAGE_NAME.HISTORY,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
