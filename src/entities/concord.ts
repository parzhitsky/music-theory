import Entity from "./entity";
import type Duration from "./duration";
import type Note from "./note";
import type Pitch from "./pitch";
import type Interval from "./interval";

/** @public */
namespace Concord {
	export interface GetCodeParams extends Entity.GetCodeParams {
		padWithSpacesAround?: boolean;
	}
}

/** @public */
class Concord extends Entity.Collection<Pitch> implements Entity.Transposable {
	private static readonly CODE_PREFIX = "[";
	private static readonly CODE_POSTFIX = "]";

	/** Sorted from lowest to highest */
	protected readonly items: readonly Pitch[];

	constructor(
		public readonly duration: Duration,
		items: (Note | Pitch)[]
	) {
		super();

		this.items = items
			.map((item) => "pitch" in item ? item.pitch : item)
			.sort((a, b) => a.frequency - b.frequency);
	}

	transpose(interval: Interval, direction = Entity.Direction.up): Concord {
		return new Concord(this.duration, this.items.map((pitch) => pitch.transpose(interval, direction)));
	}

	getCode(params: Concord.GetCodeParams = {}): string {
		const {
			concise = true,
			padWithSpacesAround = true,
		} = params;

		const pitchGetCodeParams = { concise };
		const pitchCodes = this.items.map((pitch) => pitch.getCode(pitchGetCodeParams));
		const padding = padWithSpacesAround ? " " : "";

		const chunks: string[] = [
			Concord.CODE_PREFIX,
			padding,
			...pitchCodes.join(" "),
			padding,
			Concord.CODE_POSTFIX,
		];

		return chunks.join("");
	}
}

export default Concord;
