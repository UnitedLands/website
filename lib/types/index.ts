export type aFunction<Return = any, Args extends Array<any> = Array<any>> = (
	...args: Args
) => Return
