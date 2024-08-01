import { RandomUserResponse } from 'BAD/api';

const checkJson = (response: Response): Response => {
	const contentType = response.headers.get('content-type');
	if (!contentType || !contentType.includes('application/json')) {
		throw new Error('Response was not JSON');
	}
	return response
}

// Function to fetch user data from the Random User API
export async function fetchUsers(totalUsers: number, usersPerRequest: number): Promise<RandomUserResponse['results']> {
	const requests: Promise<Response>[] = [];
	for (let page = 1; page <= Math.ceil(totalUsers / usersPerRequest); page++) {
		const url = `https://randomuser.me/api/?page=${page}&results=${usersPerRequest}`;
		requests.push(fetch(url));
	}

	const responses = await Promise.all(requests);
	const allUsersData: RandomUserResponse[] = (await Promise.all(
		responses.map((response) => checkJson(response).text())
	)).map((text) => JSON.parse(text));

	return allUsersData.flatMap((data) => data.results);
}
