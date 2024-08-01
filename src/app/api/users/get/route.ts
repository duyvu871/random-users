import { RedisArray } from '@/libs/crud/redis';
import { RandomUserResponse } from 'BAD/api';
import { fetchUsers } from '@/libs/users';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	try {
		const query = request.nextUrl.searchParams;
		const results = query.get('results') ?? 1000;
		const page = query.get('page') ?? 100;
		const resultsParsed = parseInt(results.toString());
		const pageParsed = parseInt(page.toString());

		const redisArray = new RedisArray<RandomUserResponse['results'][number]>('users:prefetch', resultsParsed);

		const pageData = await redisArray.getPage(pageParsed);

		if (!pageData) {
			return NextResponse.json({ error: 'No data found' }, { status: 404 });
		}

		const responseData: RandomUserResponse = {
			results: pageData,
			info: {
				page: pageParsed,
				results: resultsParsed,
				version: '1.0',
				seed: 'bad',
			}
		};
		return NextResponse.json(responseData, { status: 200 });
	} catch (error) {
		console.error('Error fetching or caching users: ', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}