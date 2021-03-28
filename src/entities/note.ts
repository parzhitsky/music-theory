import Entity from "./entity";
import Pitch from "./pitch";
import Duration from "./duration";
import Interval from "./interval";

/** @public */
class Note extends Entity implements Entity.Transposable {
	constructor(
		public readonly duration: Duration,
		public readonly pitch: Pitch,
	) {
		super();
	}

	transpose(interval: Interval, direction = Entity.Direction.up): Note {
		return new Note(this.duration, this.pitch.transpose(interval, direction));
	}
}

export default Note;
