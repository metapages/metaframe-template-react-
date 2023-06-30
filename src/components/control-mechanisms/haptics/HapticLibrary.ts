import { clamp } from '../../common';
import { Haptic } from './haptics-common';

/**
 * Useful class for creating complex haptic patterns
 */
class HapticInternal {
  h: Haptic;

  constructor() {
    this.h = { pattern: [], intensities: [] };
  }

  public get haptic(): Haptic {
    return this.h;
  }

  appendDelay(duration: number) {
    this.h.pattern!.push(duration);
    this.h.intensities!.push(0);
    this.h.pattern!.push(0);
    this.h.intensities!.push(0);
    return this;
  }

  appendPulse(args: { duration: number; intensity: number }) {
    const { duration, intensity } = args;
    this.h.pattern!.push(0);
    this.h.intensities!.push(0);
    this.h.pattern!.push(duration);
    this.h.intensities!.push(intensity);
    return this;
  }

  appendSmoothUp1(args: {
    steps: number;
    interval: number;
    increment: number;
    start?: number;
  }) {
    const { steps, interval, increment, start = 0 } = args;
    for (let i = 0; i < steps; i++) {
      this.h.pattern!.push(0);
      this.h.pattern!.push(start + interval);
      this.h.intensities!.push(0);
      this.h.intensities!.push(Math.min(255, start + increment * (i + 1)));
    }
    return this;
  }

  appendSmooth(args: {
    startHaptic?: number;
    endHaptic?: number;
    divisions: number;
    duration: number;
  }) {
    let { divisions, duration, endHaptic = 255, startHaptic = 0 } = args;
    const timeIncrement = Math.floor(duration / divisions);
    endHaptic = clamp(endHaptic, 0, 255);
    startHaptic = clamp(startHaptic, 0, 255);
    const hapticIncrement = Math.floor((endHaptic - startHaptic) / divisions);
    let currentHaptic = startHaptic + hapticIncrement;
    for (let i = 0; i < divisions; i++) {
      this.h.pattern!.push(0);
      this.h.pattern!.push(timeIncrement);
      this.h.intensities!.push(0);
      this.h.intensities!.push(currentHaptic);
      currentHaptic += hapticIncrement;
    }
    return this;
  }

  appendHaptic(other: Haptic) {
    this.h.pattern = this.h.pattern!.concat([...other.pattern!]);
    this.h.intensities = this.h.intensities!.concat([...other.intensities!]);
    return this;
  }
  prependHaptic(other: Haptic) {
    this.h.pattern = [...other.pattern!].concat(this.h.pattern!);
    this.h.intensities = [...other.intensities!].concat(this.h.intensities!);
    return this;
  }
}

/* "Forward and Up" one step feeling. Slides forward */
export const LeftHaptic: Haptic = new HapticInternal()
  .appendPulse({ duration: 50, intensity: 250 })
  .appendDelay(100)
  .appendSmooth({
    startHaptic: 160,
    endHaptic: 0,
    duration: 1000,
    divisions: 10,
  }).haptic;

/* "Backwards" one step feeling */
export const RightHaptic: Haptic =
  new HapticInternal()
    .appendPulse({ duration: 300, intensity: 80 })
    .appendDelay(100)
    .appendPulse({ duration: 50, intensity: 250 }).haptic;

// export const ForwardHaptic: Haptic = new HapticInternal().appendSmoothUp1({steps: 20, interval: 50, increment: 10}).haptic;
export const ForwardHaptic: Haptic = new HapticInternal()
  .appendSmooth({
    startHaptic: 0,
    endHaptic: 200,
    duration: 600,
    divisions: 10,
  })
  .appendPulse({ duration: 80, intensity: 250 })
  .appendDelay(100)
  .appendPulse({ duration: 80, intensity: 250 }).haptic;

export const BackHaptic: Haptic = new HapticInternal()

.appendPulse({ duration: 80, intensity: 230 })
.appendDelay(100)
.appendPulse({ duration: 80, intensity: 230 })
.appendDelay(100)
.appendPulse({ duration: 80, intensity: 230 })
.haptic;

const CannotGoDelay = 30;
export const CannotGoLeftHaptic: Haptic = new HapticInternal()

.appendPulse({ duration: CannotGoDelay, intensity: 230 })
.appendDelay(CannotGoDelay)
.appendPulse({ duration: CannotGoDelay, intensity: 230 })
.appendDelay(CannotGoDelay)
.appendPulse({ duration: CannotGoDelay, intensity: 230 })
.appendDelay(CannotGoDelay)
.appendPulse({ duration: CannotGoDelay, intensity: 230 })
.appendDelay(CannotGoDelay)
.appendPulse({ duration: CannotGoDelay, intensity: 230 })
.haptic;

export const CannotGoRightHaptic: Haptic = CannotGoLeftHaptic;

export const CannotGoForwardHaptic: Haptic = CannotGoLeftHaptic;
export const CannotGoBackHaptic: Haptic = CannotGoLeftHaptic;
