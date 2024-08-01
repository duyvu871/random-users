declare global {
	type TypeOfKey<T> = T extends { [key: string]: infer U } ? U : never;
	type KeyOf<T> = keyof typeof T;
	type UnionOfKeys<T> = T extends { [key: string]: any } ? keyof T : never;
}

export {};