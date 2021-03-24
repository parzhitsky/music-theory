import Entity from "./entity";
import Tone from "./tone";

/** @public */
class Pitch extends Entity {
	public static readonly BASE_TONE_FREQUENCY = 440;
	public static readonly OCTAVE_FREQUENCY_DIFFERENCE = 2;

	protected static readonly noAdjustment: Pitch.Adjustment = { value: 0, unit: null };

	/**
	 * @param steps Number of steps to cover (number sign denotes the direction)
	 * @param stepsInOctave Number of steps in octave
	 * @example
	 * Pitch.octaveWalk(semitones, Tone.SEMITONES_IN_OCTAVE)
	 */
	protected static octaveWalk(steps: number, stepsInOctave: number): number {
		return Pitch.BASE_TONE_FREQUENCY * (Pitch.OCTAVE_FREQUENCY_DIFFERENCE ** (steps / stepsInOctave));
	}

	protected static calcFrequency(tone: Tone): number {
		const semitones = Tone.calcDistance(tone);

		return Pitch.octaveWalk(semitones, Tone.SEMITONES_IN_OCTAVE);
	}

	protected static calcFrequencyWithCentAdjustment(tone: Tone, adjustmentValue: number): number {
		const semitones = Tone.calcDistance(tone);
		const cents = semitones * Tone.CENTS_IN_SEMITONE + adjustmentValue;

		return Pitch.octaveWalk(cents, Tone.CENTS_IN_OCTAVE);
	}

	public readonly frequency: number;

	constructor(
		tone: Tone,
		adjustment: Pitch.Adjustment = Pitch.noAdjustment,
	) {
		super();

		if (adjustment.value === 0)
			this.frequency = Pitch.calcFrequency(tone);

		else if (adjustment.unit === "herz")
			this.frequency = Pitch.calcFrequency(tone) + adjustment.value;

		else if (adjustment.unit === "cent")
			this.frequency = Pitch.calcFrequencyWithCentAdjustment(tone, adjustment.value);

		else if (adjustment.unit == null)
			throw new Pitch.InvalidAdjustmentError("unit:unspecified", adjustment);

		else
			throw new Pitch.InvalidAdjustmentError("unit:unknown", adjustment);
	}
}

/** @public */
namespace Pitch {
	export type AdjustmentUnit =
		| "cent"
		| "herz"
		;

	export interface Adjustment {
		value: number;
		unit: AdjustmentUnit | null; // unit isn't needed if `value` is `0`
	}

	const invalidAdjustmentMessageFactory = {
		"unit:not-supported"(adjustment: Adjustment): string {
			return `Adjustment unit "${adjustment.unit}" is not yet supported`;
		},
		"unit:unspecified"(adjustment: Adjustment): string {
			return `Adjustment unit must be specified for non-zero adjustments: ${JSON.stringify(adjustment)}`;
		},
		"unit:unknown"(adjustment: { unit?: unknown }): string {
			return `Encountered unknown adjustment unit: "${adjustment.unit}"`;
		},
	} as const;

	type InvalidAdjustmentErrorCode = keyof typeof invalidAdjustmentMessageFactory;

	export class InvalidAdjustmentError extends Error {
		constructor(code: InvalidAdjustmentErrorCode, adjustment: Adjustment) {
			super(invalidAdjustmentMessageFactory[code](adjustment));
		}
	}
}

export default Pitch;
