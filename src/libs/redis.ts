import Redis from 'ioredis';

type RedisClient = {
	instanceRedis?: Redis;
};

let client: RedisClient = {},
	statusConnectRedis = {
		CONNECT: 'connect',
		END: 'end',
		RECONNECTING: 'reconnecting',
		ERROR: 'error',
	},
	connectedTimeout: NodeJS.Timeout | null = null;

const REDIS_CONNECT_TIMEOUT = 10000,
	REDIS_CONNECT_RETRY = 5,
	REDIS_CONNECT_RETRY_DELAY = 1000,
	REDIS_CONNECT_MESSAGE = {
		code: -99,
		message: 'Redis connect timeout',
	};

const handleConnectTimeout = () => {
	connectedTimeout = setTimeout(() => {
		throw new Error(JSON.stringify(REDIS_CONNECT_MESSAGE));
	}, REDIS_CONNECT_TIMEOUT);
};

const retryConnect = (retry: number) => {
	if (retry <= REDIS_CONNECT_RETRY) {
		setTimeout(() => {
			console.log(`Retry connect to Redis ${retry}`);
			initRedis();
			retryConnect(retry + 1);
		}, REDIS_CONNECT_RETRY_DELAY);
	} else {
		handleConnectTimeout();
	}
};

const handleEventConnect = (instanceRedis: Redis) => {
	instanceRedis.on(statusConnectRedis.CONNECT, () => {
		console.log(`Redis is connected`);
		clearTimeout(connectedTimeout as NodeJS.Timeout);
	});
	instanceRedis.on(statusConnectRedis.END, () => {
		console.log(`Redis is end`);
		handleConnectTimeout();
	});
	instanceRedis.on(statusConnectRedis.RECONNECTING, () => {
		console.log(`Redis is reconnecting`);
	});
	instanceRedis.on(statusConnectRedis.ERROR, (error: Error) => {
		console.log(`Redis is error: ${error}`);
		handleConnectTimeout();
	});
};

const initRedis = () => {
	const instanceRedis = new Redis({
		enableAutoPipelining: true,
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT.toString()),
		password: process.env.REDIS_PASSWORD,
		username: process.env.REDIS_USERNAME,
	});
	client.instanceRedis = instanceRedis;
	handleEventConnect(instanceRedis);
};
const getRedis = () => client;
const closeRedis = () => {
	if (client.instanceRedis) {
		console.log('Close Redis');
		client.instanceRedis.disconnect();
	}
};

process.on('exit', function () {
	closeRedis();
});

export { initRedis, getRedis, closeRedis };
