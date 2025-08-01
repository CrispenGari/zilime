import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { COLORS, STORAGE_NAME } from "../constants";
import { zustandStorage } from "./storage";
import { TForm } from "../types";

interface TFormState {
  form: TForm;
  update: (form: TForm) => void;
  reset: () => void;
}

const initialState = {
  humidity: "",
  K: "",
  limit: 3,
  N: "",
  P: "",
  ph: "",
  rainfall: "",
  segment: "",
  segmentDescription: "",
  temperature: "",
  theme: COLORS.tertiary,
} satisfies TForm;

export const useFormStore = create<TFormState>()(
  persist(
    (set, _get) => ({
      form: initialState,
      update: (form) => set({ ..._get(), form }),
      reset: () => set({ ..._get(), form: initialState }),
    }),
    {
      name: STORAGE_NAME.FORM,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
