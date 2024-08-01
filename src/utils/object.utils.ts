import _ from 'lodash';

export class ObjectHelper {
	/**
	 * Deep copy function for TypeScript.
	 * @param T Generic type of target/copied value.
	 * @param target Target value to be copied.
	 */
	public static deepCopy<T>(target: T): T {
		if (target === null) {
			return target
		}
		if (target instanceof Date) {
			return new Date(target.getTime()) as any
		}
		// First part is for array and second part is for Realm.Collection
		// if (target instanceof Array || typeof (target as any).type === 'string') {
		if (typeof target === 'object') {
			// @ts-ignore
			if (typeof target[(Symbol as any).iterator] === 'function') {
				const cp = [] as any[]
				if ((target as any as any[]).length > 0) {
					for (const arrayMember of target as any as any[]) {
						cp.push(ObjectHelper.deepCopy(arrayMember))
					}
				}
				return cp as any as T
			} else {
				const targetKeys = Object.keys(target)
				const cp = {}
				if (targetKeys.length > 0) {
					for (const key of targetKeys) {
						// @ts-ignore
						cp[key] = ObjectHelper.deepCopy(target[key])
					}
				}
				return cp as T
			}
		}
		// Means that object is atomic
		return target
	}

	public static flattenObject(o: any, prefix: string = '', result: Record<any, any> = {}, keepNull = true) {
		if (_.isString(o) || _.isNumber(o) || _.isBoolean(o) || (keepNull && _.isNull(o))) {
			result[prefix] = o;
			return result;
		}

		if (_.isArray(o) || _.isPlainObject(o)) {
			for (let i in o) {
				let pref = prefix;
				if (_.isArray(o)) {
					pref = pref + `[${i}]`;
				} else {
					if (_.isEmpty(prefix)) {
						pref = i;
					} else {
						pref = prefix + '.' + i;
					}
				}
				ObjectHelper.flattenObject(o[i], pref, result, keepNull);
			}
			return result;
		}
		return result;
	}


	public static deFlattenObject(flatObj: Record<string, any>, separator = '.') {
		const result: Record<string, any> = {};

		for (const [key, value] of Object.entries(flatObj)) {
			const keys = key.replace(/\[(\d+)\]/g, '.$1').split(separator); // Handle array notation
			// console.log('key', key)
			let currentLevel = result;

			for (let i = 0; i < keys.length; i++) {
				const currentKey = keys[i];

				if (i === keys.length - 1) {
					// Last key, assign the value
					currentLevel[currentKey] = value;
				} else {
					// Create nested object if it doesn't exist
					if (!currentLevel[currentKey]) {
						// Check if the next key is a numeric index
						const nextKey = keys[i + 1];
						currentLevel[currentKey] = /^\d+$/.test(nextKey) ? [] : {};
					}
					currentLevel = currentLevel[currentKey];
				}
			}
		}
		return result;
	}

}