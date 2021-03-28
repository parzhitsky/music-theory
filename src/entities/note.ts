import Entity from "./entity";
import type Pitch from "./pitch";
import type Duration from "./duration";
import type Interval from "./interval";
import type Adjustment from "./adjustment";

/** @public */
class Note extends Entity implements Entity.Transposable, Entity.Adjustable {
	public readonly adjustment = this.pitch.adjustment;

	constructor(
		public readonly duration: Duration,
		public readonly pitch: Pitch,
	) {
		super();
	}

	transpose(interval: Interval, direction = Entity.Direction.up): Note {
		return new Note(this.duration, this.pitch.transpose(interval, direction));
	}

	adjust(adjustment: Adjustment): Note {
		if (this.adjustment.isZero)
			return this;

		return new Note(this.duration, this.pitch.adjust(adjustment));
	}

	unadjusted(): Note {
		if (this.adjustment.isZero)
			return this;

		return new Note(this.duration, this.pitch.unadjusted());
	}
}

export default Note;
