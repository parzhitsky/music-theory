import Note from "./note";

/** @public */
class Pitch {
	public static readonly BASE_NOTE_FREQUENCY = 440;
	public static readonly OCTAVE_FREQUENCY_DIFFERENCE = 2;

	private static readonly noAdjustment: Pitch.Adjustment = { value: 0, unit: null };

	/**
	 * @param steps Number of steps to cover (number sign denotes the direction)
	 * @param stepsInOctave Number of steps in octave
	 * @example
	 * Pitch.octaveWalk(semitones, Note.SEMITONES_IN_OCTAVE)
	 */
	private static octaveWalk(steps: number, stepsInOctave: number): number {
		return Pitch.BASE_NOTE_FREQUENCY * (Pitch.OCTAVE_FREQUENCY_DIFFERENCE ** (steps / stepsInOctave));
	}

	private static calcFrequency(note: Note): number {
		const semitones = Note.calcDistance(note);

		return Pitch.octaveWalk(semitones, Note.SEMITONES_IN_OCTAVE);
	}

	private static calcFrequencyWithCentAdjustment(note: Note, adjustmentValue: number): number {
		const semitones = Note.calcDistance(note);
		const cents = semitones * Note.CENTS_IN_SEMITONE + adjustmentValue;

		return Pitch.octaveWalk(cents, Note.CENTS_IN_OCTAVE);
	}

	public readonly frequency: number;

	constructor(
		note: Note,
		adjustment: Pitch.Adjustment = Pitch.noAdjustment,
	) {
		if (adjustment.value === 0)
			this.frequency = Pitch.calcFrequency(note);

		else if (adjustment.unit === "herz")
			this.frequency = Pitch.calcFrequency(note) + adjustment.value;

		else if (adjustment.unit === "cent")
			this.frequency = Pitch.calcFrequencyWithCentAdjustment(note, adjustment.value);

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
