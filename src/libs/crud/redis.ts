import { getRedis, initRedis } from '@/libs/redis';
import Redis from 'ioredis';

// initial redis
initRedis();
// get instance redis
const instanceRedis = getRedis().instanceRedis as Redis;
// get key
const getKey = async <T>(key: string): Promise<T | null> => {
	const result = await instanceRedis.get(key);
	if (result) return JSON.parse(result);
	return null;
};
// set key
const setKey = async <T>(key: string, value: T, expireIn: number): Promise<string> => {
	return instanceRedis.set(key, JSON.stringify(value), 'EX', expireIn);
};
// delete key
const deleteKey = async (key: string): Promise<number> => {
	return instanceRedis.del(key);
};

// RedisArray class
 class RedisArray<T> {
	private key: string;
	private itemsPerPage: number;
	private redis: Redis;

	constructor(key: string, itemsPerPage: number) {
		if (!getRedis().instanceRedis) {
			initRedis();
		}
		this.redis = getRedis().instanceRedis as Redis;
		this.key = key;
		this.itemsPerPage = itemsPerPage;
	}

	async setArray(data: T[]): Promise<void> {
		const pipeline = this.redis.pipeline();

		for (let i = 0; i < data.length; i++) {
			// Sử dụng JSON.stringify cho đối tượng
			const value = JSON.stringify(data[i]);
			pipeline.hset(this.key, i.toString(), value);
		}
		await pipeline.exec();
	}

	async getPage(pageNumber: number): Promise<T[]> {
		const startIndex = (pageNumber - 1) * this.itemsPerPage;
		const endIndex = startIndex + this.itemsPerPage - 1;

		// get all redis data
		const data = await this.redis.hgetall(this.key);

		const pageData: T[] = [];
		// sort keys
		const sortedKeys = Object.keys(data).map(Number).sort((a, b) => a - b);

		for (const key of sortedKeys) {
			if (key >= startIndex && key <= endIndex) {
				// parse data
				pageData.push(JSON.parse(data[key]));
			}
		}

		return pageData;
	}

	async getTotalPages(): Promise<number> {
		const totalItems = await this.redis.hlen(this.key);
		return Math.ceil(totalItems / this.itemsPerPage);
	}
}

export { getKey, setKey, deleteKey, RedisArray };
