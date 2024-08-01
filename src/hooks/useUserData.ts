import { useAtom } from 'jotai/index';
import {
	queryInfoPaginatedStore,
	queryInfoStore,
	usersPaginatedStore,
	usersStore,
} from '@/states/users';
import { RandomUserResponse } from 'BAD/api';
import axiosInstance from '@/libs/axios';
import { useCallback } from 'react';

type FetchUsersParams = {
	page?: number;
	results?: number;
}

export const useUserData = () => {
	const [paginateUsers, setPaginateUsers] = useAtom(usersPaginatedStore);
	const [paginateQueryInfo, setPaginateQueryInfo] = useAtom(queryInfoPaginatedStore);
	const [users, setUsers] = useAtom(usersStore);
	const [queryInfo, setQueryInfo] = useAtom(queryInfoStore);

	const fetchUsers = useCallback(async ({ page = 1, results = 10 }: FetchUsersParams = {}): Promise<RandomUserResponse> => {
		try {
			const prevQueryInfo = paginateQueryInfo[`${page}`];
			const prevUsers = paginateUsers[`${page}`];
			if (prevUsers && prevQueryInfo) {
				setUsers(prevUsers);
				setQueryInfo(prevQueryInfo);
				return { results: prevUsers , info: prevQueryInfo };
			}
			const response = await axiosInstance.get<RandomUserResponse>('', {
				params: {
					page,
					results,
				},
			});
			setUsers(response.data.results);
			setQueryInfo(response.data.info);
			setPaginateUsers({ ...paginateUsers, [page?.toString()]: response.data.results });
			setPaginateQueryInfo({ ...paginateQueryInfo, [page?.toString()]: response.data.info });
			return response.data;
		} catch (error) {
			console.error('Error fetching data:', error);
			throw error;
		}
	}, [paginateQueryInfo, paginateUsers, setPaginateQueryInfo, setPaginateUsers, setQueryInfo, setUsers]);
	const sortUsers = useCallback((users: RandomUserResponse['results']) => {}, []);
	return { users, queryInfo, fetchUsers };
}