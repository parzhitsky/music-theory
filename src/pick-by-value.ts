/** @public */
type PickByValue<Obj extends object, Value> = Pick<Obj, {
	[Key in keyof Obj]: Obj[Key] extends Value ? Key : never;
}[keyof Obj]>;

export default PickByValue;
