import Entity from "./entity";
import type Pitch from "./pitch";
import type Duration from "./duration";
import type Interval from "./interval";

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
