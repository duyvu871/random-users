import React, { forwardRef, useEffect } from 'react';
import { cn } from "@/utils/tailwind.utils";
import { usePagination, PaginationElementType } from "@/hooks/usePagination";
import { useAtom } from 'jotai/index';
import { paginationState } from '@/states/pagination';
import useUID from '@/hooks/useUID';

interface PaginateIndexProps extends React.HTMLProps<HTMLDivElement> {
	contentIndex: string | number;
	isActive: boolean;
}

const PaginateIndex = forwardRef<HTMLDivElement, PaginateIndexProps>((props, ref) => {
	const { contentIndex, isActive, ...rest } = props;
	return (
		<li>
			<div
				ref={ref}
				{...rest}
				 className={cn(
					 "flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border",
					 "border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400",
					 "dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer",
					 {
						 "text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700": isActive
					 }
				 )}
			>
				{contentIndex}
			</div>
		</li>
	)
});

const Pagination = () => {
	const [state, setPaginationState] = useAtom(paginationState);
	const [genId] = useUID();
	// Pagination range
	const paginationRange = usePagination({
		currentPage: state.currentPage,
		totalCount: state.totalCount,
		siblingCount: state.siblingCount,
		pageSize: state.pageSize,
	});
	// If there is only one page, don't render pagination
	if (state.currentPage === 0 || paginationRange.length < 2) {
		return null;
	}
	// Page change handler
	const onPageChange = (page: number | string) => {
		const parsedPage = typeof page === 'string' ? parseInt(page) : page;
		if (parsedPage < 0 || parsedPage > state.totalCount) {
			return;
		}
		setPaginationState((prev) => ({ ...prev, currentPage: parsedPage }));
	}
	// Next page handler
	const onNext = () => {
		onPageChange(state.currentPage + 1);
	};
	// Previous page handler
	const onPrevious = () => {
		onPageChange(state.currentPage - 1);
	};

	let lastPage = paginationRange[paginationRange.length - 1];

	return (
		<ul className="flex items-center -space-x-px h-10 text-base">
			{/* Left navigation arrow */}
			<li>
				<div
					className={cn(
						'flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0',
						" border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700",
						"dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer"
					)}
					onClick={onPrevious}
				>
					<span className="sr-only">Previous</span>
					<svg
						className="w-3 h-3 rtl:rotate-180"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 6 10"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M5 1 1 5l4 4"
						/>
					</svg>
				</div>
			</li>
			{paginationRange.map((pageNumber) => {
				// If the pageItem is a DOT, render the DOTS unicode character
				if (pageNumber === PaginationElementType.DOTS) {
					return <PaginateIndex key={genId()} contentIndex={'...'} isActive={false} />
				}

				return <PaginateIndex
								key={genId()}
								contentIndex={pageNumber}
								isActive={pageNumber === state.currentPage}
								onClick={() => onPageChange(pageNumber)}
							/>
			})}
			{/*  Right Navigation arrow */}
			<li>
				<div
					className={cn(
						'flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 cursor-pointer',
							"rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
						)}
					onClick={onNext}
				>
					<span className="sr-only"> Next</span>
					<svg
						className="w-3 h-3 rtl:rotate-180"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 6 10"
					>
						<path
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="m1 9 4-4-4-4"
						/>
					</svg>
				</div>
			</li>
		</ul>
	);
};

export default Pagination;
