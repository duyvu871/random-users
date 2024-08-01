import axiosInstance from '@/libs/axios';
import { RandomUserResponse } from 'BAD/api';

interface FetchUsersParams {
	page?: number;
	results?: number;
}

// Set default values directly within the interface
const fetchUsers = async ({ page = 1, results = 10 }: FetchUsersParams = {}): Promise<RandomUserResponse> => {
	try {
		const response = await axiosInstance.get('', {
			params: {
				page,
				results,
			},
		});

		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
		throw error;
	}
};

export { fetchUsers };