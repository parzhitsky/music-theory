/** @public */
// FIXME: ts enums are broken, don't add trailing ";" after enum declaration
namespace Note {
	export const enum Letter {
		C = 0,
		D = 1,
		E = 2,
		F = 3,
		G = 4,
		A = 5,
		B = 6,
		/** @deprecated Use `Note.Letter.B` instead */
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
		/** @alias Note.Octave.small */ firstSmall = 3,

		oneLine = 4,
		/** @alias Note.Octave.oneLine */ middle = 4,
		/** @alias Note.Octave.oneLine */ secondSmall = 4,

		twoLine = 5,
		/** @alias Note.Octave.twoLine */ thirdSmall = 5,

		threeLine = 6,
		/** @alias Note.Octave.threeLine */ fourthSmall = 6,

		fourLine = 7,
		/** @alias Note.Octave.fourLine */ fifthSmall = 7,

		fiveLine = 8,
		/** @alias Note.Octave.fiveLine */ sixthSmall = 8,
	}
}

/** @private */
const distanceFromOctaveStart = {
	// @ts-ignore (FIXME: ts enums are broken)
	[Note.Letter.C]: 0,
	// @ts-ignore (FIXME: ts enums are broken)
	[Note.Letter.D]: 2,
	// @ts-ignore (FIXME: ts enums are broken)
	[Note.Letter.E]: 4,
	// @ts-ignore (FIXME: ts enums are broken)
	[Note.Letter.F]: 5,
	// @ts-ignore (FIXME: ts enums are broken)
	[Note.Letter.G]: 7,
	// @ts-ignore (FIXME: ts enums are broken)
	[Note.Letter.A]: 9,
	// @ts-ignore (FIXME: ts enums are broken)
	[Note.Letter.B]: 11,
} as const;

/** @public */
class Note {
	public static readonly SEMITONES_IN_OCTAVE = 12;
	public static readonly CENTS_IN_SEMITONE = 100;
	public static readonly CENTS_IN_OCTAVE = Note.CENTS_IN_SEMITONE * Note.SEMITONES_IN_OCTAVE;
	public static readonly BASE = new Note(Note.Letter.A, Note.Alteration.natural, Note.Octave.oneLine);

	static calcDistance(to: Note, from = Note.BASE): number {
		return to.value - from.value;
	}

	public readonly value: number;

	constructor(
		public readonly letter: Note.Letter,
		public readonly alteration: Note.Alteration = Note.Alteration.natural,
		public readonly octave: Note.Octave = Note.Octave.oneLine,
	) {
		this.value = octave * Note.SEMITONES_IN_OCTAVE + distanceFromOctaveStart[letter] + alteration;
	}
}

export default Note;
