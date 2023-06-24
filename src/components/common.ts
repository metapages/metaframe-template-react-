import {
  fromEuler,
  Quaternion,
} from 'quaternion';

export type EulerArray = [number, number, number];

/**
 *
 * @returns [-1, 1]
 */

export const createNormalizer = (
  valuesToCapture: number = 30,
  scale: number = 1
) => {
  let min: number | null = null;
  let max: number | null = null;
  let count: number = 0;
  return (value: number): number => {
    count++;
    if (min === null) {
      min = value;
    }
    if (max === null) {
      max = value;
    }
    min = Math.min(min, value);
    max = Math.max(max, value);
    if (count < valuesToCapture) {
      return 0;
    }
    return (((value - min) / (max - min)) * 2 - 1) * scale;
  };
};

export interface OrientationPoint {
  qx: number;
  qy: number;
  qw: number;
  qz: number;
  // pitch:number;
  // roll:number;
  // yaw:number;
  // t:number;
}

export interface EulerPoint {
  // qx:number;
  // qy:number;
  // qw:number;
  // qz:number;
  pitch: number;
  roll: number;
  yaw: number;
  // t:number;
}

export const yawFromQuaternion = (o: typeof Quaternion): number => {
  // https://dulacp.com/2013/03/computing-the-ios-device-tilt.html
  // double yaw = asin(2*(quat.x*quat.z - quat.w*quat.y));
  const yaw = Math.asin(2 * (o.x * o.z - o.w * o.y));
  return yaw;
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const rad = Math.PI / 180;
export const rotateEulerFromBaselineQuaternion = (
  orientation: EulerArray,
  baselineQuaternion: typeof Quaternion
): EulerPoint => {
  var quaternionToScale = fromEuler(
    orientation[0] * rad,
    orientation[1] * rad,
    orientation[2] * rad,
    "ZXY"
  );
  // var quaternionToScale = fromEuler(orientation[0], orientation[1], orientation[2], 'ZXY');
  // var quaternionToScale = fromEuler(orientation[0] * rad, orientation[1] * rad, orientation[2] * rad, 'XYZ');
  var transformedQuaternion = quaternionToScale.div(baselineQuaternion);
  const euler = transformedQuaternion.toEuler();
  // Bad minification renames fields
  // https://github.com/infusion/Quaternion.js/issues/14
  // {g: 0.0009325499825654654, pitch: -0.005843426107864001, h: 0.0032194327928523558}
  // @ts-ignore
  if (euler.g) {
    // @ts-ignore
    euler.roll = euler.g;
    // @ts-ignore
    delete euler.g;
  }
  // @ts-ignore
  if (euler.h) {
    // @ts-ignore
    euler.yaw = euler.h;
    // @ts-ignore
    delete euler.h;
  }
  euler.pitch = euler.pitch / rad;
  euler.roll = euler.roll / rad;
  euler.yaw = euler.yaw / rad;
  return euler;
};

export const Tau = Math.PI * 2;
// https://stackoverflow.com/questions/1878907/how-can-i-find-the-smallest-difference-between-two-angles-around-a-point
export const getAbsoluteDifferenceAngles = (x: number, y: number) => {
  return Math.min(Tau - Math.abs(x - y), Math.abs(x - y));
};
