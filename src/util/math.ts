/**
 * Clamps a value agains minimum and maximum values.
 *
 * @param value The value to be clamped
 * @param floor The minimum value
 * @param ceil The maximum value
 */
export function clamp(value: number, floor: number = 0, ceil: number = 1) {
  return Math.min(ceil, Math.max(floor, value));
}
