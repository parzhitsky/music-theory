import Entity from "./entity";
import Interval from "./interval";
import type Tone from "./tone";

/** @private */
const tone = new Interval(Interval.Origin.majorSecond);
const semitone = new Interval(Interval.Origin.minorSecond);

/** @private */
const scaleMatrix = {
	major: [
		tone,
		tone,
		semitone,
		tone,
		tone,
		tone,
		semitone,
	],
	minor: [
		tone,
		semitone,
		tone,
		tone,
		semitone,
		tone,
		tone,
	],
} as const;

/** @public */
class Tonality extends Entity.Collection<Tone> {
	protected readonly items: readonly Tone[];

	constructor(
		public readonly base: Tone,
		public readonly key: Tonality.Key,
		// TODO: variant: "harmonic" | "melodic"
	) {
		super();

		const tones = [ base ];

		for (const interval of scaleMatrix[key]) {
			const last = tones[tones.length - 1];
			const next = last.transpose(interval);

			tones.push(next);
		}

		this.items = tones;
	}

	// TODO: getCode()

	// TODO: getItem(index: Tone.Letter, augmentation = Interval.Augmentation.none): Tone
}

/** @public */
namespace Tonality {
	export type Key = keyof typeof scaleMatrix;
}

export default Tonality;
