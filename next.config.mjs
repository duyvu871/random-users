/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		minimumCacheTTL: 60,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'randomuser.me',
				port: '',
				pathname: '/api/**',
			},
		],
	},

};

export default nextConfig;
