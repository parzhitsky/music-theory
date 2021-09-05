import type Adjustment from "./adjustment";
import type Interval from "./interval";
import type Tone from "./tone";

declare global {
	interface Constructor<Instance extends object = object> {
		new (...args: never[]): Instance;
	}

	interface Function extends Constructor {}
}

/** @public */
abstract class Entity {
	// abstract equals(entity: this): boolean;

	protected static _modulo(base: number, operand: number): number {
		return ((operand % base) + base) % base;
	}

	protected static assertIntegerArguments(args: Record<string, number>): never | void {
		for (const name in args)
			if (!Number.isInteger(args[name]))
				throw new this.InvalidArgumentError(name, args[name], "expected an integer");
	}

	getCode(): string {
		throw new Entity.NotEncodableError(this.constructor);
	}
}

/** @public */
namespace Entity {
	export interface GetCodeParams {
		concise?: boolean;
	}

	export const enum Direction {
		up = 1,
		down = -1,
	}

	export interface Transposable {
		transpose(interval: Interval, direction?: Direction): ThisType<this>;
	}

	export interface Adjustable {
		readonly adjustment: Adjustment;

		adjust(adjustment: Adjustment): ThisType<this>;
		unadjusted(): ThisType<this>;
	}

	export interface Alterable {
		readonly alteration: Tone.Alteration;

		alter(alteration: Tone.Alteration): ThisType<this>;
	}

	export abstract class Error extends global.Error {
		constructor(message: string, hint?: string) {
			super(`${message}${hint == null ? "" : ` (${hint})`}`);
		}
	}

	export class NotEncodableError extends Error {
		constructor(entityConstructor: Constructor) {
			super(`Cannot get code of ${entityConstructor.name} entity`);
		}
	}

	export class InvalidArgumentError extends Error {
		constructor(argumentName: string, value: unknown, hint?: string) {
			super(`Argument '${argumentName}' is invalid: ${value}`, hint);
		}
	}

	export class UnsupportedAdjustmentError extends Error {
		constructor(adjustment: Adjustment, hint?: string) {
			super(`Unsupported adjustment: ${JSON.stringify(adjustment)}`, hint);
		}
	}

	export class FeatureNotImplementedError extends Error {
		constructor(featureDescription: string) {
			super("This feature is not implemented", featureDescription);
		}
	}

	export abstract class Collection<Item extends Entity> extends Entity {
		protected abstract readonly items: readonly Item[];

		hasItem(index: number): boolean {
			return this.items[index] != null;
		}

		getItem(index: number): Item {
			if (!this.hasItem(index))
				throw new Collection.ItemNotFoundError(index);

			return this.items[index];
		}
	}

	export namespace Collection {
		export class ItemNotFoundError extends Error {
			constructor(index: number) {
				super(`Item with index ${index} does not exist in the collection`);
			}
		}
	}
}

export default Entity;
