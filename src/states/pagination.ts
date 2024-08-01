import { atom } from 'jotai';

type PaginationState = {
	currentPage: number;
	pageSize: number;
	totalCount: number;
	siblingCount: number;
};


export const paginationState = atom<PaginationState>({
	currentPage: 1,
	pageSize: 10,
	totalCount: 100,
	siblingCount: 1,
});

export const isLoadingNewPage = atom<boolean>(false);