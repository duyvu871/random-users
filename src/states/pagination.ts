import { atom } from 'jotai';

export const paginationState = atom({
	currentPage: 1,
	pageSize: 10,
	totalCount: 100,
	siblingCount: 1,
});
