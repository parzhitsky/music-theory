/** @public */
namespace Entity {
	export interface GetCodeParams {
		concise?: boolean;
	}
}

/** @public */
abstract class Entity {
	// abstract equals(entity: this): boolean;

	getCode(): string {
		return `[object ${this.constructor.name}]`;
	}
}

export default Entity;
