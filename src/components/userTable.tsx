import React, { useEffect, useLayoutEffect, useState, Suspense } from 'react';
import { useAtom } from 'jotai/index';
import { isLoadingNewPage, paginationState } from '@/states/pagination';
import { useUserData } from '@/hooks/useUserData';
import { RandomUserResponse } from 'BAD/api';
import Table, { Column } from '@/components/table';
import { usersPaginatedStore } from '@/states/users';
import RotateLoader from '@/components/rotateLoader';

const columns: Column<RandomUserResponse['results'][number]>[] = [
	{
		name: "Full Name",
		type: 'plainText',
		key: "name.first",
		customClass: "font-bold",
		isSort: true,
		customRender: (item, key) => `${item.name.title} ${item.name.first} ${item.name.last}`
	},
	{
		name: "Username",
		type: 'plainText',
		key: "login.username",
		customClass: "text-blue-700",
		isSort: true,
		customRender: (item, key) => `@${item.login.username}`
	},
	{
		name: "Avatar",
		type: 'image',
		key: "picture.thumbnail",
		customClass: "rounded-full"
	}
];

function UserTable() {
	const [currentPaginateState, setCurrentPaginateState] = useAtom(paginationState);
	const [isLoading, setIsLoading] = useAtom(isLoadingNewPage);

	// cached data of current page index
	const [currentPage, setCurrentPage] = useState<number>(1);
	const {users, fetchUsers} = useUserData();
	const [currentDataResults, setCurrentDataResults] = useState<RandomUserResponse['results']>([]);
	const [currentDataInfo, setCurrentDataInfo] = useState<RandomUserResponse['info'] | null>(null);

	const getUsers = async (page: number) => {
		setIsLoading(true);
		const data = await fetchUsers({ page, results: 10 }).then((res) => {
			setIsLoading(false);
			return res;
		});
		setCurrentDataResults(data.results);
		setCurrentDataInfo(data.info);
	}

	useEffect(() => {
		(async() => {
			if (currentPaginateState.currentPage !== currentPage) {
				await getUsers(currentPaginateState.currentPage);
				setCurrentPage(currentPaginateState.currentPage);
			}
		})();
	}, [currentDataInfo, currentDataResults, currentPaginateState]);

	useLayoutEffect(() => {
		// Set the initial data
		getUsers(1);
	}, []);

	return (
		<Suspense fallback={<RotateLoader />}>
			<div className={"flex-grow flex justify-center items-center"}>
				{(currentDataResults.length === 0 || isLoading)
					? <RotateLoader />
					: <Table data={currentDataResults} columns={columns}/>
				}
			</div>
		</Suspense>
	);
}

export default UserTable;