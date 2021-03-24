import Entity from "./entity";

export default class Duration extends Entity {
	constructor(
		public readonly value: number,
	) {
		super();
	}
}
