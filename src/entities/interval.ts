import Entity from "./entity";
import Adjustment from "./adjustment";

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
	type Origins = typeof origins;

	export type Kind = (typeof kinds)[number];
	export type Origin = keyof Origins;
	export type Quality = Origins[Origin]["quality"];
	export type Augmentation = number;
}

/** @public */
class Interval extends Entity implements Entity.Adjustable, Entity.Transposable {
	public static readonly SEMITONES_IN_OCTAVE = 12;
	public static readonly CENTS_IN_SEMITONE = 100;
	public static readonly CENTS_IN_OCTAVE = Interval.CENTS_IN_SEMITONE * Interval.SEMITONES_IN_OCTAVE;

	public readonly quality = origins[this.origin].quality;
	public readonly letterDiff = origins[this.origin].kindIndex;
	public readonly kind = kinds[this.letterDiff];

	public readonly semitonesWithoutAdjustment =
		this.origin + this.augmentation + this.octaves * Interval.SEMITONES_IN_OCTAVE;
	public readonly semitones = this.semitonesWithoutAdjustment;
	public readonly semitonesWithAdjustment =
		this.semitonesWithoutAdjustment + this.adjustment.value / Interval.CENTS_IN_SEMITONE;

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

	transpose(interval: Interval, direction = Entity.Direction.up): Interval {
		// TODO: maybe needed for Tonality tone augmentations
		throw new Interval.FeatureNotImplementedError("transposing intervals");
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
