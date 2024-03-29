import {create} from "zustand";
// import {create} from "../zustand-nut";

interface BearState {
  bears: number; // 状态值
  count: number;

  increase: (by?: number) => void;
  decrease: (by?: number) => void;
  reset: () => void;

  increaseCount: () => void;
}

const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  count: 100,
  increase: (by = 1) => set((state) => ({bears: state.bears + by})),
  decrease: (by = 1) => set((state) => ({bears: state.bears - by})),
  reset: () => set({bears: 0}),

  increaseCount: () => set((state) => ({count: state.count + 1})),
}));

export default useBearStore;
