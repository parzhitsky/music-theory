import Entity from "./entity";

/** @private */
type KeysByValue<Value extends Obj[keyof Obj], Obj extends object> = {
	[Key in keyof Obj]: Obj[Key] extends Value ? Key : never;
}[keyof Obj];

/** @private */
const kindByUnit = {
	cent: "chromatic",
	herz: "chromatic",
	// tone: "diatonic",
} as const;

/** @public */
class Interval extends Entity {
	public static readonly DEFAULT_UNIT: Interval.Unit = "cent";

	public readonly isZero: boolean = this.value === 0;
	public readonly isReversed: boolean = this.value < 0;
	public readonly unit: Interval.Unit | null;
	public readonly kind: Interval.Kind;

	constructor(
		public readonly value: number,
		unit: Interval.Unit | null = Interval.DEFAULT_UNIT,
	) {
		super();

		if (value !== 0 && unit == null)
			throw new Interval.UnitUnspecifiedError(value, unit);

		this.unit = unit ?? null;
		this.kind = kindByUnit[this.unit ?? Interval.DEFAULT_UNIT];
	}
}

/** @public */
namespace Interval {
	export const zero: Interval = new Interval(0);
	export const quarterToneUp: Interval = new Interval(50);
	export const quarterToneDown: Interval = new Interval(-50);

	export interface Zero {
		value: 0;
		unit: Interval.Unit | null;
	}

	export interface NonZero {
		value: number;
		unit: Interval.Unit;
	}

	export type Raw = Zero | NonZero;

	type UnitKinds = typeof kindByUnit;

	export type Unit = keyof UnitKinds;
	export type Kind = UnitKinds[Unit];

	export namespace Unit {
		export type Chromatic = KeysByValue<"chromatic", UnitKinds>;
		// export type Diatonic = KeysByValue<"diatonic", UnitKinds>;
	}

	export class UnitUnspecifiedError extends Error {
		constructor(...[ value, unit ]: ConstructorParameters<typeof Interval>) {
			super(`Intervals with non-zero values must have unit specified (value: ${value}, unit: ${unit})`);
		}
	}
}

export default Interval;
