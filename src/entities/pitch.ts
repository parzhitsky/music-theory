import Entity from "./entity";
import Tone from "./tone";

/** @private */
function numberWithSign(value: number): string {
	return `${value >= 0 ? "+" : ""}${value}`;
}

/** @public */
class Pitch extends Entity {
	public static readonly BASE_TONE_FREQUENCY = 440;
	public static readonly OCTAVE_FREQUENCY_DIFFERENCE = 2;
	public static readonly ADJUSTMENT_CODE_PREFIX = "&";
	public static readonly ADJUSTMENT_CODE_DEFAULT_UNIT: Pitch.AdjustmentUnit = "cent";

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

	protected static calcAdjustmentCode(adjustment: Pitch.Adjustment): string {
		const unit = adjustment.value !== 0 ? adjustment.unit! : Pitch.ADJUSTMENT_CODE_DEFAULT_UNIT;
		const value = numberWithSign(adjustment.value);

		return Pitch.ADJUSTMENT_CODE_PREFIX + unit + value;
	}

	public readonly frequency: number;

	constructor(
		protected readonly tone: Tone,
		protected readonly adjustment: Pitch.Adjustment = Pitch.Adjustment.none,
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

	/**
	 * @example
	 * const gSharp3 = new Tone(4, 1, 3);
	 * const gSharp3Up20Hz = new Pitch(gSharp3, { value: 20, unit: "herz" });
	 *
	 * gSharp3Up20Hz.getCode();
	 * // => "G#3&herz+20"
	 */
	getCode(params: Entity.GetCodeParams = {}): string {
		const { concise = true } = params;

		const chunks: string[] = [ this.tone.getCode({ concise }), "" ];

		if (this.adjustment.value !== 0 || !concise)
			chunks[1] = Pitch.calcAdjustmentCode(this.adjustment);

		return chunks.join("");
	}
}

/** @public */
namespace Pitch {
	export type AdjustmentUnit =
		| "cent"
		| "herz"
		;

	export type Adjustment = {
		value: 0;
		unit?: AdjustmentUnit | null;
	} | {
		value: number;
		unit: AdjustmentUnit;
	};

	export namespace Adjustment {
		export const none: Pitch.Adjustment = { value: 0 };
		export const quarterToneUp: Pitch.Adjustment = { value: 50, unit: "cent" };
		export const quarterToneDown: Pitch.Adjustment = { value: -50, unit: "cent" };
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
