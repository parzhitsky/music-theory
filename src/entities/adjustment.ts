import Entity from "./entity";

/** @public */
class Adjustment extends Entity {
	public static readonly DEFAULT_UNIT: Adjustment.Unit = "cent";
	public static readonly CODE_PREFIX = "&";

	public readonly unit: Adjustment.Unit | null;
	public readonly isZero: boolean = this.value === 0;

	constructor(
		public readonly value: number,
		unit: Adjustment.Unit | null = Adjustment.DEFAULT_UNIT,
	) {
		super();

		if (value !== 0 && unit == null)
			throw new Adjustment.UnitUnspecifiedError(value, unit);

		this.unit = unit ?? null;
	}

	getCode(): string {
		const unit = this.unit ?? Adjustment.DEFAULT_UNIT;
		const sign = this.value >= 0 ? "+" : ""; // negative numbers already have the minus sign

		return Adjustment.CODE_PREFIX + unit + sign + this.value;
	}

	add(other: Adjustment): Adjustment {
		if (other.isZero)
			return this;

		if (this.isZero)
			return other;

		if (other.unit !== this.unit)
			throw new Adjustment.AddError(`units aren't the same: "${this.unit}" and "${other.unit}"`);

		return new Adjustment(this.value + other.value, this.unit);
	}
}

/** @public */
namespace Adjustment {
	export const zero: Adjustment = new Adjustment(0);

	export type Unit =
		| "cent"
		| "herz"
		;

	export class UnitUnspecifiedError extends Entity.Error {
		constructor(value: number, unit: unknown) {
			super("Non-zero adjustment must have a specified unit", JSON.stringify({ value, unit }));
		}
	}

	export class AddError extends Entity.Error {
		constructor(hint: string) {
			super("Failed to add two adjustments", hint);
		}
	}
}

export default Adjustment;
