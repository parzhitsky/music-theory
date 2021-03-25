import Entity from "./entity";

/** @public */
class Interval extends Entity {
	public static readonly DEFAULT_UNIT: Interval.Unit = "cent";

	public static readonly zero: Interval = new Interval(0);
	public static readonly quarterToneUp: Interval = new Interval(50);
	public static readonly quarterToneDown: Interval = new Interval(-50);

	public readonly unit: Interval.Unit | null;
	public readonly isZero: boolean = this.value === 0;
	public readonly isReversed: boolean = this.value < 0;

	constructor(
		public readonly value: number,
		unit: Interval.Unit | null = Interval.DEFAULT_UNIT,
	) {
		super();

		this.unit = unit ?? null;

		if (this.value !== 0 && this.unit == null)
			throw new Interval.UnitUnspecifiedError(value, unit);
	}
}

/** @public */
namespace Interval {
	export interface Zero {
		value: 0;
		unit: Interval.Unit | null;
	}

	export interface NonZero {
		value: number;
		unit: Interval.Unit;
	}

	export type Type = Zero | NonZero;

	export type Unit =
		| "cent"
		| "herz"
		;

	export class UnitUnspecifiedError extends Error {
		constructor(...[ value, unit ]: ConstructorParameters<typeof Interval>) {
			super(`Intervals with non-zero values must have unit specified (value: ${value}, unit: ${unit})`);
		}
	}
}

export default Interval;
