/** @public */
abstract class Entity {
	// abstract equals(entity: this): boolean;

	getCode(): string {
		return `[object ${this.constructor.name}]`;
	}
}

/** @public */
namespace Entity {
	export interface GetCodeParams {
		concise?: boolean;
	}

	export abstract class Collection<Item extends Entity> extends Entity {
		protected abstract readonly items: Item[];

		get length(): number {
			return this.items.length;
		}

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
