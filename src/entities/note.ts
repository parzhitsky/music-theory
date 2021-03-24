import Entity from "./entity";
import Pitch from "./pitch";
import Duration from "./duration";

/** @public */
class Note extends Entity {
	constructor(
		public readonly pitch: Pitch,
		public readonly duration: Duration,
	) {
		super();
	}
}

export default Note;
