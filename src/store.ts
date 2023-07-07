import { MiniSignal } from 'mini-signals';
import Quaternion from 'quaternion';
import { create } from 'zustand';

import { MetaframeInputMap } from '@metapages/metapage';

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

  // listen and push to the metaframe
  metaframeInputs: MiniSignal<[MetaframeInputMap]>;
  metaframeOutputs: MiniSignal<[MetaframeInputMap]>;
}

export const useStore = create<MainStore>((set, get) => ({
  quaternionBaseline: null,
  sendHapticStream: true,
  setQuaternionBaseline: (quaternionBaseline: Quaternion | null) =>
    set((state) => ({ quaternionBaseline })),
  setSendHapticStream: (sendHapticStream: boolean) =>
    set((state) => ({ sendHapticStream })),

  deviceIO: null,
  setDeviceIO: (deviceIO: DeviceIO | null) => set((state) => ({ deviceIO })),

  metaframeInputs: new MiniSignal<[MetaframeInputMap]>(),
  metaframeOutputs: new MiniSignal<[MetaframeInputMap]>(),
}));

export const KeyUrlDeviceIO = "channel";
