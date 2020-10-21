/**
 * Clamps a value agains minimum and maximum values.
 *
 * @param floor The minimum value
 * @param ceil The maximum value
 * @param value The value to be clamped
 */
export function clamp(floor: number, ceil: number, value: number) {
  return Math.min(ceil, Math.max(floor, value));
}
