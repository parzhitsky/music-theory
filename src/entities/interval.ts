import Entity from "./entity";
import Adjustment from "./adjustment";
import Step from "./step";

/** @private */
const origins = {
	[0]: {
		quality: "Perfect",
		stepValue: Step.Value.tonic,
	},
	[1]: {
		quality: "Minor",
		stepValue: Step.Value.supertonic,
	},
	[2]: {
		quality: "Major",
		stepValue: Step.Value.supertonic,
	},
	[3]: {
		quality: "Minor",
		stepValue: Step.Value.mediant,
	},
	[4]: {
		quality: "Major",
		stepValue: Step.Value.mediant,
	},
	[5]: {
		quality: "Perfect",
		stepValue: Step.Value.subdominant,
	},
	[7]: {
		quality: "Perfect",
		stepValue: Step.Value.dominant,
	},
	[8]: {
		quality: "Minor",
		stepValue: Step.Value.submediant,
	},
	[9]: {
		quality: "Major",
		stepValue: Step.Value.submediant,
	},
	[10]: {
		quality: "Minor",
		stepValue: Step.Value.subtonic,
	},
	[11]: {
		quality: "Major",
		stepValue: Step.Value.subtonic,
	},
} as const;

/** @private */
const kinds = {
	[Step.Value.tonic]: "Unison",
	[Step.Value.supertonic]: "Second",
	[Step.Value.mediant]: "Third",
	[Step.Value.subdominant]: "Fourth",
	[Step.Value.dominant]: "Fifth",
	[Step.Value.submediant]: "Sixth",
	[Step.Value.subtonic]: "Seventh",
} as const;

/** @public */
namespace Interval {
	type Origins = typeof origins;

	export type Kind = (typeof kinds)[Step.Value];
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
	public readonly letterDiff = origins[this.origin].stepValue;
	public readonly kind = kinds[this.letterDiff];

	protected readonly semitonesWithoutAdjustment = this.origin + this.augmentation + this.octaves * Interval.SEMITONES_IN_OCTAVE;
	public readonly semitones = this.semitonesWithoutAdjustment + this.adjustment.value / Interval.CENTS_IN_SEMITONE;
	public readonly cents = this.semitonesWithoutAdjustment * Interval.CENTS_IN_SEMITONE + this.adjustment.value;
	public readonly isZero = this.cents === 0;

	constructor(
		public readonly origin: Interval.Origin,
		public readonly augmentation = Interval.Augmentation.none,
		public readonly octaves = 0,
		public readonly adjustment = Adjustment.zero,
	) {
		super();

		Interval.assertIntegerArguments({ octaves });

		if (adjustment.unit !== "cent" && !adjustment.isZero)
			throw new Adjustment.UnsupportedError(adjustment, "intervals support only 'cent' adjustments; other adjustments must be zero");
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

	export const perfectUnison = new Interval(Origin.perfectUnison);
	export const minorSecond = new Interval(Origin.minorSecond);
	export const majorSecond = new Interval(Origin.majorSecond);
	export const minorThird = new Interval(Origin.minorThird);
	export const majorThird = new Interval(Origin.majorThird);
	export const perfectFourth = new Interval(Origin.perfectFourth);
	export const perfectFifth = new Interval(Origin.perfectFifth);
	export const minorSixth = new Interval(Origin.minorSixth);
	export const majorSixth = new Interval(Origin.majorSixth);
	export const minorSeventh = new Interval(Origin.minorSeventh);
	export const majorSeventh = new Interval(Origin.majorSeventh);
	export const perfectOctave = new Interval(Origin.perfectUnison, Augmentation.none, 1);
}

export default Interval;
