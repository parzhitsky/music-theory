import Entity from "./entity";

/** @public */
// FIXME: enums are broken, don't add trailing ";" after enum declaration
namespace Tone {
	export const enum Letter {
		C = 0,
		D = 1,
		E = 2,
		F = 3,
		G = 4,
		A = 5,
		B = 6,
		/** @deprecated Use `Tone.Letter.B` instead */
		H = 6,
	}

	export const enum Alteration {
		doubleFlat = -2,
		flat = -1,
		natural = 0,
		sharp = 1,
		doubleSharp = 2,
	}

	export const enum Octave {
		subContra = 0,

		contra = 1,

		great = 2,

		small = 3,
		/** @alias Tone.Octave.small */ firstSmall = 3,

		oneLine = 4,
		/** @alias Tone.Octave.oneLine */ middle = 4,
		/** @alias Tone.Octave.oneLine */ secondSmall = 4,

		twoLine = 5,
		/** @alias Tone.Octave.twoLine */ thirdSmall = 5,

		threeLine = 6,
		/** @alias Tone.Octave.threeLine */ fourthSmall = 6,

		fourLine = 7,
		/** @alias Tone.Octave.fourLine */ fifthSmall = 7,

		fiveLine = 8,
		/** @alias Tone.Octave.fiveLine */ sixthSmall = 8,
	}
}

/** @private */
const distanceFromOctaveStart = {
	// @ts-ignore (FIXME: enums are broken)
	[Tone.Letter.C]: 0,
	// @ts-ignore (FIXME: enums are broken)
	[Tone.Letter.D]: 2,
	// @ts-ignore (FIXME: enums are broken)
	[Tone.Letter.E]: 4,
	// @ts-ignore (FIXME: enums are broken)
	[Tone.Letter.F]: 5,
	// @ts-ignore (FIXME: enums are broken)
	[Tone.Letter.G]: 7,
	// @ts-ignore (FIXME: enums are broken)
	[Tone.Letter.A]: 9,
	// @ts-ignore (FIXME: enums are broken)
	[Tone.Letter.B]: 11,
} as const;

/** @public */
class Tone extends Entity {
	public static readonly SEMITONES_IN_OCTAVE = 12;
	public static readonly CENTS_IN_SEMITONE = 100;
	public static readonly CENTS_IN_OCTAVE = Tone.CENTS_IN_SEMITONE * Tone.SEMITONES_IN_OCTAVE;
	public static readonly BASE = new Tone(Tone.Letter.A, Tone.Alteration.natural, Tone.Octave.oneLine);

	static calcDistance(to: Tone, from = Tone.BASE): number {
		return to.value - from.value;
	}

	public readonly value: number;

	constructor(
		public readonly letter: Tone.Letter,
		public readonly alteration: Tone.Alteration = Tone.Alteration.natural,
		public readonly octave: Tone.Octave = Tone.Octave.oneLine,
	) {
		super();

		this.value = octave * Tone.SEMITONES_IN_OCTAVE + distanceFromOctaveStart[letter] + alteration;
	}
}

export default Tone;
