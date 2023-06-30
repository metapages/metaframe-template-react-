export const HAPT = 1;

export const HAPTIC_RANGE_FOR_APPROACHING_GENTLE_CONTACT = {min:1, max:200};
export const HAPTIC_INTERVAL_FOR_APPROACHING_GENTLE_CONTACT = 50;

/**
 * This is the JSON format you can send to the phone
 * Best to use [pattern, intensities] for the pattern
 */
export type Haptic = {
    amplitude?: number;
    duration?: number;
    pattern?: number[];
    intensities?: number[];
    repeat?: number;
    cancel?: boolean;
  }
