import Entity from "./entity";
import Duration from "./duration";
import Note from "./note";
import Pitch from "./pitch";

/** @public */
namespace Concord {
	export interface GetCodeParams extends Entity.GetCodeParams {
		padWithSpacesAround?: boolean;
	}
}

/** @public */
class Concord extends Entity {
	private static readonly CODE_PREFIX = "[";
	private static readonly CODE_POSTFIX = "]";

	/** Sorted from lowest to highest */
	public readonly pitches: Pitch[] = [];

	constructor(
		public readonly duration: Duration,
		items: (Note | Pitch)[]
	) {
		super();

		this.pitches = items
			.map((item) => "pitch" in item ? item.pitch : item)
			.sort((a, b) => a.frequency - b.frequency);
	}

	getCode(params: Concord.GetCodeParams = {}): string {
		const {
			concise = true,
			padWithSpacesAround = true,
		} = params;

		const pitchGetCodeParams = { concise };
		const pitchCodes = this.pitches.map((pitch) => pitch.getCode(pitchGetCodeParams));
		const spaceAround = padWithSpacesAround ? " " : "";

		const chunks: string[] = [
			Concord.CODE_PREFIX,
			spaceAround,
			...pitchCodes.join(" "),
			spaceAround,
			Concord.CODE_POSTFIX,
		];

		return chunks.join("");
	}
}

export default Concord;
