import Entity from "./entity";
import Interval from "./interval";
import Step from "./step";

/** @private */
const letters = {
	[Step.Value.tonic]: {
		code: "C",
		intervalFromC: Interval.Origin.perfectUnison,
	},
	[Step.Value.supertonic]: {
		code: "D",
		intervalFromC: Interval.Origin.majorSecond,
	},
	[Step.Value.mediant]: {
		code: "E",
		intervalFromC: Interval.Origin.majorThird,
	},
	[Step.Value.subdominant]: {
		code: "F",
		intervalFromC: Interval.Origin.perfectFourth,
	},
	[Step.Value.dominant]: {
		code: "G",
		intervalFromC: Interval.Origin.perfectFifth,
	},
	[Step.Value.submediant]: {
		code: "A",
		intervalFromC: Interval.Origin.majorSixth,
	},
	[Step.Value.subtonic]: {
		code: "B",
		intervalFromC: Interval.Origin.majorSeventh,
	},
} as const;

/** @private */
const alterations = {
	[-2]: {
		name: "doubleFlat",
		code: "bb",
	},
	[-1]: {
		name: "flat",
		code: "b",
	},
	[+0]: {
		name: "natural",
		code: "n",
	},
	[+1]: {
		name: "sharp",
		code: "#",
	},
	[+2]: {
		name: "doubleSharp",
		code: "x",
	},
} as const;

/** @public */
namespace Tone {
	export type Letter = Step.Value;
	export type Alteration = number;
	export type Octave = number;

	export type LetterCode = (typeof letters)[Letter]["code"];
}

/** @public */
class Tone extends Entity implements Entity.Transposable {
	public static readonly LETTERS_IN_OCTAVE = Step.STEPS_IN_OCTAVE;
	public static readonly BASE =
		new Tone(/* Tone.Letter.A */ 5, /* Tone.Alteration.natural */ 0, /* Tone.Octave.oneLine */ 4);

	protected static readonly DOUBLE_SINGLE_SHARP_PATTERN = new RegExp(alterations[1].code.repeat(2), "g");

	static calcValue(letter: Tone.Letter, alteration: Tone.Alteration, octave: Tone.Octave): number {
		return octave * Interval.SEMITONES_IN_OCTAVE + letters[letter].intervalFromC + alteration;
	}

	static calcDistance(to: Tone, from = Tone.BASE): number {
		return to.value - from.value;
	}

	static mod(from: number, steps = 0, direction = Entity.Direction.up): Tone.Letter {
		return super._modulo(Tone.LETTERS_IN_OCTAVE, from + steps * direction) as Tone.Letter;
	}

	public readonly value: number;

	constructor(
		public readonly letter: Tone.Letter,
		public readonly alteration: Tone.Alteration = Tone.Alteration.natural,
		public readonly octave: Tone.Octave = Tone.Octave.oneLine,
	) {
		super();

		this.value = Tone.calcValue(letter, alteration, octave);
	}

	/**
	 * @example
	 * const gSharp3 = new Tone(4, 1, 3);
	 *
	 * gSharp3.getCode();
	 * // => "G#3"
	 */
	getCode(params: Entity.GetCodeParams = {}): string {
		const { concise = true } = params;

		const chunks = [ letters[this.letter].code, "", this.octave ];

		if (this.alteration !== 0) {
			const sign = Math.sign(this.alteration) as Entity.Direction;
			const character = alterations[sign].code;
			const size = Math.abs(this.alteration);
			const string = character.repeat(size);

			chunks[1] = string.replace(Tone.DOUBLE_SINGLE_SHARP_PATTERN, Tone.AlterationCode.doubleSharp);
		}

		else if (!concise)
			chunks[1] = Tone.AlterationCode.natural;

		return chunks.join("");
	}

	transpose(interval: Interval, direction = Entity.Direction.up): Tone {
		if (!interval.adjustment.isZero)
			throw new Tone.UnsupportedAdjustmentError(interval.adjustment, "tones can be transposed only by unadjusted intervals");

		const letterWithOverflow = this.letter + interval.letterDiff * direction;
		const octaveRollOver = Math.floor(letterWithOverflow / Tone.LETTERS_IN_OCTAVE);
		const letter = Tone.mod(letterWithOverflow);
		const octave = this.octave + interval.octaves + octaveRollOver;
		const valueNatural = Tone.calcValue(letter, Tone.Alteration.natural, octave);
		const value = this.value + interval.semitones * direction;
		const alteration = value - valueNatural;

		return new Tone(letter, alteration, octave);
	}
}

/** @public */
namespace Tone {
	export namespace Letter {
		export const C = 0;
		export const D = 1;
		export const E = 2;
		export const F = 3;
		export const G = 4;
		export const A = 5;
		export const B = 6;

		/** @deprecated Use `Tone.Letter.B` instead */
		export const H = 6;
	}

	export namespace Alteration {
		export const doubleFlat = -2;
		export const flat = -1;
		export const natural = 0;
		export const sharp = 1;
		export const doubleSharp = 2;
	}

	export namespace AlterationCode {
		export const doubleFlat = alterations[Alteration.doubleFlat].code;
		export const flat = alterations[Alteration.flat].code;
		export const natural = alterations[Alteration.natural].code;
		export const sharp = alterations[Alteration.sharp].code;
		export const doubleSharp = alterations[Alteration.doubleSharp].code;
	}

	export namespace Octave {
		export const subContra = 0;
		export const contra = 1;
		export const great = 2;
		export const small = 3;
		export const oneLine = 4;
		/** @alias Tone.Octave.oneLine */ export const middle = 4;
		export const twoLine = 5;
		export const threeLine = 6;
		export const fourLine = 7;
		export const fiveLine = 8;
	}
}

export default Tone;
