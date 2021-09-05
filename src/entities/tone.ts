import Alteration from "./alteration";
import Adjustment from "./adjustment";
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

/** @public */
namespace Tone {
	export type Letter = Step.Value;

	export namespace Letter {
		export type C = Step.Value.Tonic;
		export type D = Step.Value.Supertonic;
		export type E = Step.Value.Mediant;
		export type F = Step.Value.Subdominant;
		export type G = Step.Value.Dominant;
		export type A = Step.Value.Submediant;
		export type B = Step.Value.Subtonic;

		/** @deprecated Use `Tone.Letter.B` instead */
		export type H = Step.Value.Subtonic;
	}

	export type LetterCode = (typeof letters)[Letter]["code"];

	export type Octave = number;

	export namespace Octave {
		export type SubContra = 0;
		export type Contra = 1;
		export type Great = 2;
		export type Small = 3;
		export type OneLine = 4;
		/** @alias Tone.Octave.OneLine */
		export type Middle = 4;
		export type TwoLine = 5;
		export type ThreeLine = 6;
		export type FourLine = 7;
		export type FiveLine = 8;
	}
}

/** @public */
class Tone extends Entity implements Entity.Transposable, Entity.Alterable {
	public static readonly LETTERS_IN_OCTAVE = Step.STEPS_IN_OCTAVE;
	public static readonly BASE = new Tone(/* Tone.Letter.A */ 5, Alteration.Value.natural, /* Tone.Octave.oneLine */ 4);

	static calcValue(letter: Tone.Letter, alteration: Alteration, octave: Tone.Octave): number {
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
		public readonly alteration: Alteration = Alteration.Value.natural,
		public readonly octave: Tone.Octave = Tone.Octave.oneLine,
	) {
		super();

		Tone.assertIntegerArguments({ alteration, octave });

		this.value = Tone.calcValue(letter, alteration, octave);
	}

	/**
	 * @example
	 * const gSharp3 = new Tone(4, 1, 3);
	 *
	 * gSharp3.getCode();
	 * // => "G#3"
	 */
	getCode({
		concise = true,
	}: Entity.GetCodeParams = {}): string {
		const chunks = [
			letters[this.letter].code,
			Alteration.getCodeByValue(this.alteration, { concise }),
			this.octave,
		];

		return chunks.join("");
	}

	transpose(interval: Interval, direction = Entity.Direction.up): Tone {
		if (!interval.adjustment.isZero)
			throw new Adjustment.UnsupportedError(interval.adjustment, "tones can be transposed only by unadjusted intervals");

		const letterWithOverflow = this.letter + interval.letterDiff * direction;
		const octaveRollOver = Math.floor(letterWithOverflow / Tone.LETTERS_IN_OCTAVE);
		const letter = Tone.mod(letterWithOverflow);
		const octave = this.octave + interval.octaves + octaveRollOver;
		const valueNatural = Tone.calcValue(letter, Alteration.Value.natural, octave);
		const value = this.value + interval.semitones * direction;
		const alteration = value - valueNatural;

		return new Tone(letter, alteration, octave);
	}

	alter(alteration: Alteration): Tone {
		if (alteration === 0)
			return this;

		return new Tone(this.letter, this.alteration + alteration, this.octave);
	}

	unaltered(): Tone {
		if (this.alteration === 0)
			return this;

		return new Tone(this.letter, Alteration.Value.natural, this.octave);
	}
}

/** @public */
namespace Tone {
	export namespace Letter {
		export const C = Step.Value.tonic;
		export const D = Step.Value.supertonic;
		export const E = Step.Value.mediant;
		export const F = Step.Value.subdominant;
		export const G = Step.Value.dominant;
		export const A = Step.Value.submediant;
		export const B = Step.Value.subtonic;

		/** @deprecated Use `Tone.Letter.B` instead */
		export const H = Step.Value.subtonic;
	}

	export namespace Octave {
		export const subContra = 0;
		export const contra = 1;
		export const great = 2;
		export const small = 3;
		export const oneLine = 4;
		/** @alias Tone.Octave.oneLine */
		export const middle = 4;
		export const twoLine = 5;
		export const threeLine = 6;
		export const fourLine = 7;
		export const fiveLine = 8;
	}

	export const C = new Tone(Letter.C);
	export const D = new Tone(Letter.D);
	export const E = new Tone(Letter.E);
	export const F = new Tone(Letter.F);
	export const G = new Tone(Letter.G);
	export const A = new Tone(Letter.A);
	export const B = new Tone(Letter.B);

	/** @deprecated Use `Tone.B` instead */
	export const H = new Tone(Letter.H);
}

export default Tone;
