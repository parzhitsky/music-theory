import Entity from "./entity";
import Adjustment from "./adjustment";
import type PickByValue from "../pick-by-value";

/** @private */
const origins = {
	[0]: {
		quality: "Perfect",
		kindIndex: 0,
	},
	[1]: {
		quality: "Minor",
		kindIndex: 1,
	},
	[2]: {
		quality: "Major",
		kindIndex: 1,
	},
	[3]: {
		quality: "Minor",
		kindIndex: 2,
	},
	[4]: {
		quality: "Major",
		kindIndex: 2,
	},
	[5]: {
		quality: "Perfect",
		kindIndex: 3,
	},
	[7]: {
		quality: "Perfect",
		kindIndex: 4,
	},
	[8]: {
		quality: "Minor",
		kindIndex: 5,
	},
	[9]: {
		quality: "Major",
		kindIndex: 5,
	},
	[10]: {
		quality: "Minor",
		kindIndex: 6,
	},
	[11]: {
		quality: "Major",
		kindIndex: 6,
	},
} as const;

/** @private */
const kinds = [
	"Unison",
	"Second",
	"Third",
	"Fourth",
	"Fifth",
	"Sixth",
	"Seventh",
] as const;

/** @public */
namespace Interval {
	export type Augmentation = number;

	export namespace Quality {
		export type Perfect = "Perfect";
		export type Major = "Major";
		export type Minor = "Minor";
		export type NonPerfect = Major | Minor;
	}

	export type Quality = Quality.Perfect | Quality.Major | Quality.Minor;

	type Origins = typeof origins;

	export type Origin = keyof Origins;

	export namespace Origin {
		export type Perfect = keyof PickByValue<Origins, { quality: Quality.Perfect }>;
		export type Major = keyof PickByValue<Origins, { quality: Quality.Major }>;
		export type Minor = keyof PickByValue<Origins, { quality: Quality.Minor }>;
		export type NonPerfect = Major | Minor;
	}

	type Kinds = typeof kinds;

	export type Kind = Kinds[number];

	export namespace Kind {
		export type Perfect = Kinds[Origins[Origin.Perfect]["kindIndex"]];
		export type NonPerfect = Kinds[Origins[Origin.NonPerfect]["kindIndex"]];
	}

	export namespace Name {
		export type Perfect = `Perfect ${Kind.Perfect}`;
		export type Major = `Major ${Kind.NonPerfect}`;
		export type Minor = `Minor ${Kind.NonPerfect}`;
		export type NonPerfect = Major | Minor;

		export type Unison = `${Quality.Perfect} Unison`;
		export type Second = `${Quality.NonPerfect} Second`;
		export type Third = `${Quality.NonPerfect} Third`;
		export type Fourth = `${Quality.Perfect} Fourth`;
		export type Fifth = `${Quality.Perfect} Fifth`;
		export type Sixth = `${Quality.NonPerfect} Sixth`;
		export type Seventh = `${Quality.NonPerfect} Seventh`;
	}

	export type Name = Name.Perfect | Name.Major | Name.Minor;
}

/** @public */
class Interval extends Entity implements Entity.Adjustable {
	public static readonly SEMITONES_IN_OCTAVE = 12;
	public static readonly CENTS_IN_SEMITONE = 100;
	public static readonly CENTS_IN_OCTAVE = Interval.CENTS_IN_SEMITONE * Interval.SEMITONES_IN_OCTAVE;

	public readonly quality = origins[this.origin].quality;
	public readonly letterDiff = origins[this.origin].kindIndex;
	public readonly kind = kinds[this.letterDiff];
	public readonly name = (this.quality + this.kind) as Interval.Name;

	public readonly semitonesWithoutAdjustment =
		this.origin + this.augmentation + this.octaves * Interval.SEMITONES_IN_OCTAVE;
	public readonly semitonesWithAdjustment = this.semitonesWithoutAdjustment;
	public readonly semitones =
		this.semitonesWithoutAdjustment + this.adjustment.value * Interval.CENTS_IN_SEMITONE;

	constructor(
		public readonly origin: Interval.Origin,
		public readonly augmentation = Interval.Augmentation.none,
		public readonly octaves = 0,
		public readonly adjustment = Adjustment.zero,
	) {
		super();

		if (octaves % 1 !== 0)
			throw new Interval.InvalidArgumentError("octaves", octaves, "value must be an integer");

		if (!adjustment.isZero && adjustment.unit !== "cent")
			throw new Interval.UnsupportedAdjustmentError(adjustment, "intervals support only zero and 'cent' adjustments");
	}

	adjust(adjustment: Adjustment): Interval {
		if (adjustment.isZero)
			return this;

		return new Interval(this.origin, this.augmentation, this.octaves, this.adjustment.add(adjustment));
	}

	unadjusted(): Interval {
		if (this.adjustment.isZero)
			return this;

		return new Interval(this.origin, this.augmentation, this.octaves, Adjustment.zero);
	}

	add(other: Interval): Interval {
		throw new Interval.FeatureNotImplementedError("adding two intervals");
	}
}

/** @public */
namespace Interval {
	export namespace Origin {
		export const perfectUnison = 0;
		export const minorSecond = 1;
		export const majorSecond = 2;
		export const minorThird = 3;
		export const majorThird = 4;
		export const perfectFourth = 5;
		export const perfectFifth = 7;
		export const minorSixth = 8;
		export const majorSixth = 9;
		export const minorSeventh = 10;
		export const majorSeventh = 11;
	}

	export namespace Augmentation {
		export const dimDim = -2;
		export const dim = -1;
		export const none = 0;
		export const aug = +1;
		export const augAug = +2;
	};
}

export default Interval;
