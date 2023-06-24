import Quaternion from 'quaternion';
import { create } from 'zustand';

interface MainStore {
  quaternionBaseline: Quaternion | null;
  setQuaternionBaseline: (q: Quaternion | null) => void;
  sendHapticStream: boolean;
  setSendHapticStream: (sendHapticStream: boolean) => void;
}

export const useStore = create<MainStore>((set, get) => ({
  quaternionBaseline: null,
  sendHapticStream: true,
  setQuaternionBaseline: (quaternionBaseline: Quaternion | null) =>
    set((state) => ({ quaternionBaseline })),
  setSendHapticStream: (sendHapticStream: boolean) =>
    set((state) => ({ sendHapticStream })),
}));
