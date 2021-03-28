import Entity from "./entity";
import Adjustment from "./adjustment";
import Interval from "./interval";
import Tone from "./tone";

/** @public */
class Pitch extends Entity {
	/** Frequency of `Tone.BASE` */
	public static readonly BASE_TONE_FREQUENCY = 440;
	public static readonly OCTAVE_FREQUENCY_DIFFERENCE = 2;

	/**
	 * @param steps Number of steps to cover (number sign denotes the direction)
	 * @param stepsInOctave Number of steps in octave
	 * @example
	 * Pitch.calcFrequency(semitones, Tone.SEMITONES_IN_OCTAVE)
	 */
	protected static calcFrequency(steps: number, stepsInOctave: number): number {
		return Pitch.BASE_TONE_FREQUENCY * (Pitch.OCTAVE_FREQUENCY_DIFFERENCE ** (steps / stepsInOctave));
	}

	public readonly frequency: number;

	constructor(
		protected readonly tone: Tone,
		protected readonly adjustment: Adjustment = Adjustment.zero,
	) {
		super();

		const semitones = Tone.calcDistance(tone);

		if (adjustment.unit === "cent")
			this.frequency = Pitch.calcFrequency(semitones * Interval.CENTS_IN_SEMITONE + adjustment.value, Interval.CENTS_IN_OCTAVE);

		else if (adjustment.unit === "herz" || adjustment.isZero)
			this.frequency = Pitch.calcFrequency(semitones, Interval.SEMITONES_IN_OCTAVE) + adjustment.value;

		else
			throw new Pitch.UnsupportedAdjustmentError(adjustment);
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
			chunks[1] = this.adjustment.getCode();

		return chunks.join("");
	}
}

/** @public */
namespace Pitch {
}

export default Pitch;
