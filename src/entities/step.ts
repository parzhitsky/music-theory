import Entity from "./entity";

/** @public */
namespace Step {
	export type Value = 0 | 1 | 2 | 3 | 4 | 5 | 6;

	export namespace Value {
		export type Tonic = 0;
		export type Supertonic = 1;
		export type Mediant = 2;
		export type Subdominant = 3;
		export type Dominant = 4;
		export type Submediant = 5;
		export type Subtonic = 6;
	}
}

/** @public */
// TODO: this should be the Tonality.Item
// TODO: the idea is to have an entity close to Tone, but the octave information is relative, as in "current octave", "1 octave higher", "2 octaves lower", etc.
class Step extends Entity {
	public static readonly STEPS_IN_OCTAVE = 7;

	constructor(
		public readonly value: Step.Value,
		public readonly alteration = 0,
		public readonly octave = 0,
	) {
		super();

		Step.assertIntegerArguments({ alteration, octave });
	}
}

/** @public */
namespace Step {
	export namespace Value {
		export const tonic = 0;
		export const supertonic = 1;
		export const mediant = 2;
		export const subdominant = 3;
		export const dominant = 4;
		export const submediant = 5;
		export const subtonic = 6;
	}

	export const tonic = new Step(Step.Value.tonic);
	export const supertonic = new Step(Step.Value.supertonic);
	export const mediant = new Step(Step.Value.mediant);
	export const subdominant = new Step(Step.Value.subdominant);
	export const dominant = new Step(Step.Value.dominant);
	export const submediant = new Step(Step.Value.submediant);
	export const subtonic = new Step(Step.Value.subtonic);
}

export default Step;
