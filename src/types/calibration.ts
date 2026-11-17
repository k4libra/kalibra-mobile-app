/**
 * Presentation states of the adaptive calibration dial.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

export type CalibrationState = 'calibrating' | 'low' | 'medium' | 'high';

/** Measured subtopic snapshot carried into guided practice without another request. */
export interface CalibrationContext {
  /** Display name already loaded by the originating screen. */
  name: string;
  /** Exact mastery percentage; null means unknown. */
  mastery: number | null;
}
