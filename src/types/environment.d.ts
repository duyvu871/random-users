declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: 'development' | 'production';
			PORT: number;
			// main feature api endpoint
			NEXT_PUBLIC_API_ENDPOINT: string;
			// redis cloud env
			SECRET_KEY: string;
			REDIS_HOST: string;
			REDIS_PORT: number;
			REDIS_PASSWORD: string;
			REDIS_USERNAME: string;
		}
	}
}

export {};