import type Entity from "./entity";

/** @private */
const alterations = {
	[-2]: {
		name: "doubleFlat",
		code: "bb",
	},
	[-1]: {
		name: "flat",
		code: "b",
	},
	[+0]: {
		name: "natural",
		code: "n",
	},
	[+1]: {
		name: "sharp",
		code: "#",
	},
	[+2]: {
		name: "doubleSharp",
		code: "x",
	},
} as const;

/** @private */
const doubleSingleSharpPattern = new RegExp(Alteration.Code.sharp.repeat(2), "g");

/** @public */
namespace Alteration {
	export namespace Value {
		export type DoubleFlat = -2;
		export type Flat = -1;
		export type Natural = 0;
		export type Sharp = 1;
		export type DoubleSharp = 2;

		export type Kind = Flat | Sharp;

		export type Known =
			| DoubleFlat
			| Flat
			| Natural
			| Sharp
			| DoubleSharp
			;

		export type Unknown = number;

		export const doubleFlat = -2;
		export const flat = -1;
		export const natural = 0;
		export const sharp = 1;
		export const doubleSharp = 2;
	}

	/** @deprecated Use `Alteration` or `Alteration.Value.Unknown` instead */
	export type Value = Value.Unknown;

	// ***

	export namespace Code {
		type Alterations = typeof alterations;

		export type DoubleFlat = Alterations[Value.DoubleFlat]["code"];
		export type Flat = Alterations[Value.Flat]["code"];
		export type Natural = Alterations[Value.Natural]["code"];
		export type Sharp = Alterations[Value.Sharp]["code"];
		export type DoubleSharp = Alterations[Value.DoubleSharp]["code"];

		export type Kind = Flat | Sharp;

		export type Known =
			| DoubleFlat
			| Flat
			| Natural
			| Sharp
			| DoubleSharp
			;

		export type Unknown = string;

		export const doubleFlat = alterations[Value.doubleFlat].code;
		export const flat = alterations[Value.flat].code;
		export const natural = alterations[Value.natural].code;
		export const sharp = alterations[Value.sharp].code;
		export const doubleSharp = alterations[Value.doubleSharp].code;
	}

	/** @deprecated Use `Alteration.Code.Unknown` instead */
	export type Code = Code.Unknown;

	// ***

	export function getCodeByValue(value: Value.Known, params?: Entity.GetCodeParams): Code.Known;
	export function getCodeByValue(value: Value.Unknown, params?: Entity.GetCodeParams): Code.Unknown;

	export function getCodeByValue(value: number, {
		concise = true,
	}: Entity.GetCodeParams = {}): string {
		if (value === 0)
			return concise ? "" : Alteration.Code.natural;

		if (value in alterations)
			return alterations[value as Value.Known].code;

		const size = Math.abs(value);
		const sign = Math.sign(value) as Entity.Direction;
		const code = alterations[sign].code;

		return code.repeat(size).replace(doubleSingleSharpPattern, Alteration.Code.doubleSharp);
	}

	// TODO: function getValueByCode()
}

/** @public */
type Alteration = Alteration.Value.Unknown;

export default Alteration;
