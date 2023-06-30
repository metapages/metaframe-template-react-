import { MiniSignal } from 'mini-signals';
import Quaternion from 'quaternion';
import { create } from 'zustand';

import { EulerArray } from './components/common';
import { Haptic } from './components/control-mechanisms/haptics/haptics-common';

export interface DeviceIO {
  haptics: MiniSignal<[Haptic]>;
  userAccelerometer: MiniSignal<[EulerArray]>;
  userOrientation: MiniSignal<[EulerArray]>;
}

interface MainStore {
  quaternionBaseline: Quaternion | null;
  setQuaternionBaseline: (q: Quaternion | null) => void;
  sendHapticStream: boolean;
  setSendHapticStream: (sendHapticStream: boolean) => void;

  deviceIO: DeviceIO | null;
  setDeviceIO: (deviceIO: DeviceIO | null) => void;

  // signalHapticStream: MiniSignal<[Haptic]> | null;
  // signalUserAccelerometerStream: MiniSignal<[EulerArray]> | null;
  // signalUserOrientationStream: MiniSignal<[EulerArray]> | null;

  // setSignalHapticStream: (
  //   signalHapticStream: MiniSignal<[Haptic]> | null
  // ) => void;
  // setSignalUserAccelerometerStream: (
  //   signalUserAccelerometerStream: MiniSignal<[EulerArray]> | null
  // ) => void;
  // setSignalUserOrientationStream: (
  //   signalUserOrientationStream: MiniSignal<[EulerArray]> | null
  // ) => void;
}

export const useStore = create<MainStore>((set, get) => ({
  quaternionBaseline: null,
  sendHapticStream: true,
  setQuaternionBaseline: (quaternionBaseline: Quaternion | null) =>
    set((state) => ({ quaternionBaseline })),
  setSendHapticStream: (sendHapticStream: boolean) =>
    set((state) => ({ sendHapticStream })),

  deviceIO: null,
  // signalUserAccelerometerStream: null,
  // signalUserOrientationStream: null,

  setDeviceIO: (deviceIO: DeviceIO | null) => set((state) => ({ deviceIO })),
  // setSignalUserAccelerometerStream: (
  //   signalUserAccelerometerStream: MiniSignal<[EulerArray]> | null
  // ) => set((state) => ({ signalUserAccelerometerStream })),
  // setSignalUserOrientationStream: (
  //   signalUserOrientationStream: MiniSignal<[EulerArray]> | null
  // ) => set((state) => ({ signalUserOrientationStream })),
}));
