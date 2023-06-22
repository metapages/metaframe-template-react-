import { Quaternion } from 'quaternion';

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
}
