import { NextRequest, NextResponse } from 'next/server';
import { RandomUserResponse } from 'BAD/api';
import { getKey, RedisArray } from '@/libs/crud/redis';
import {fetchUsers} from '@/libs/users';
import { getRedis, initRedis } from '@/libs/redis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	try {
		// simple way to prevent public access to public api
		const headerPassword = request.headers.get('Authorization');
		if (!headerPassword) {
			return NextResponse.json({
				message: "connect timeout"
			}, {
				status: 500
			});
		}
		const adminPassword = await getKey('admin');
		if (adminPassword !== headerPassword) {
			return NextResponse.json({
				message: "connect timeout"
			}, {
				status: 500
			});
		}

		// init redis to put array data into pipeline
		const redisArray = new RedisArray<RandomUserResponse['results'][number]>('users:prefetch', 10);

		// Fetch users (adjust batch size as needed)
		const totalUsersToFetch = 1000;
		const usersPerRequest = 500;
		const allUsers = await fetchUsers(totalUsersToFetch, usersPerRequest);
		// put data to pipeline
		await redisArray.setArray(allUsers);

		return NextResponse.json(allUsers, {
			status: 200,
			headers: {
				"x-localed": '0'
			}
		});
	} catch (error) {
		console.error('Error fetching or caching users: ', error);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}