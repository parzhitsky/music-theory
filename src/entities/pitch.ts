import Entity from "./entity";
import Interval from "./interval";
import Tone from "./tone";

/** @public */
class Pitch extends Entity {
	/** Frequency of `Tone.BASE` */
	public static readonly BASE_TONE_FREQUENCY = 440;
	public static readonly OCTAVE_FREQUENCY_DIFFERENCE = 2;
	public static readonly ADJUSTMENT_CODE_PREFIX = "&";
	public static readonly ADJUSTMENT_CODE_DEFAULT_UNIT = Interval.DEFAULT_UNIT;

	/**
	 * @param steps Number of steps to cover (number sign denotes the direction)
	 * @param stepsInOctave Number of steps in octave
	 * @example
	 * Pitch.calcFrequency(semitones, Tone.SEMITONES_IN_OCTAVE)
	 */
	protected static calcFrequency(steps: number, stepsInOctave: number): number {
		return Pitch.BASE_TONE_FREQUENCY * (Pitch.OCTAVE_FREQUENCY_DIFFERENCE ** (steps / stepsInOctave));
	}

	protected static calcAdjustmentCode(adjustment: Interval): string {
		const unit = adjustment.unit ?? Pitch.ADJUSTMENT_CODE_DEFAULT_UNIT;
		const sign = adjustment.value >= 0 ? "+" : ""; // negative numbers already have the minus sign

		return Pitch.ADJUSTMENT_CODE_PREFIX + unit + sign + adjustment.value;
	}

	public readonly frequency: number;

	constructor(
		protected readonly tone: Tone,
		protected readonly adjustment: Interval = Interval.zero,
	) {
		super();

		const semitones = Tone.calcDistance(tone);

		if (adjustment.unit === "cent")
			this.frequency = Pitch.calcFrequency(semitones * Tone.CENTS_IN_SEMITONE + adjustment.value, Tone.CENTS_IN_OCTAVE);

		else if (adjustment.unit === "herz" || adjustment.isZero)
			this.frequency = Pitch.calcFrequency(semitones, Tone.SEMITONES_IN_OCTAVE) + adjustment.value;

		else
			throw new Pitch.UnknownAdjustmentUnitError(adjustment.unit);
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

		if (!this.adjustment.isZero || !concise)
			chunks[1] = Pitch.calcAdjustmentCode(this.adjustment);

		return chunks.join("");
	}
}

/** @public */
namespace Pitch {
	/** @alias `Interval` */
	export type Adjustment = Interval;

	export class UnknownAdjustmentUnitError extends Error {
		constructor(unit: unknown) {
			super(`Unknown adjustment unit: ${unit}`);
		}
	}
}

export default Pitch;
