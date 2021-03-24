import Pitch from "./pitch";
import Duration from "./duration";

/** @public */
class Note {
	constructor(
		public readonly pitch: Pitch,
		public readonly duration: Duration,
	) {}
}

export default Note;
