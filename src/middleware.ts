import {NextRequest, NextResponse} from "next/server";
import {Ratelimit} from "@upstash/ratelimit";
import {kv} from '@vercel/kv';

const rateLimit = new Ratelimit({
	redis: kv,
	// 5 requests from the same IP in 10 seconds
	limiter: Ratelimit.slidingWindow(10, '1s')
});

export const config = {
	matcher: '/'
};

export default async function middleware(request: NextRequest) {
	const ip = request.ip ?? '127.0.0.1';
	if (ip === '127.0.0.1') return NextResponse.next();
	const {success, pending, reset, remaining} = await rateLimit.limit(
		ip
	);

	return success ? NextResponse.next() : NextResponse.json({
		message: "server timeout",
		type: 'RATE_LIMIT'
	}, {
		status: 429,
		headers: {
			'X-RateLimit-Remaining': String(remaining),
			'X-RateLimit-Reset': String(reset),
			'X-RateLimit-Limit': '10',
			'Retry-After': String(pending)
		}
	})
}