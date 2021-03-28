declare global {
	interface Function {
		new(...args: string[]): Function;
	}
}

/** @public */
abstract class Entity {
	// abstract equals(entity: this): boolean;

	protected static _modulo(base: number, operand: number): number {
		return ((operand % base) + base) % base;
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
	};

	export class NotEncodableError extends Error {
		constructor(entityConstructor: Function) {
			super(`Cannot get code of ${entityConstructor.name} entity`);
		}
	}

	export class InvalidArgumentError extends Error {
		constructor(argumentName: string, value: unknown, hint?: string) {
			super(`Argument '${argumentName}' is invalid: ${value}${hint == null ? "" : ` (${hint})`}`);
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
