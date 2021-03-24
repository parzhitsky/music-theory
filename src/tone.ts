import Pitch from "./pitch";
import Duration from "./duration";

/** @public */
class Tone {
	constructor(
		public readonly pitch: Pitch,
		public readonly duration: Duration,
	) {}
}

export default Tone;
