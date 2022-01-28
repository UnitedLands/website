export type TypedObject<Obj extends Record<any, any>> = Obj & ThisType<Obj>

export function typedObject<Obj extends Record<any, any>>(obj: TypedObject<Obj>) {
	return obj
}
