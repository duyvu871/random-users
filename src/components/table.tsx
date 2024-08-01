"use client";
import React, { FC, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { RandomUserResponse, User } from 'BAD/api';
import useUID from '@/hooks/useUID';
import { ObjectHelper } from '@/utils/object.utils';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/utils/tailwind.utils';
import { ClassValue } from 'clsx';
import { FaSort } from 'react-icons/fa';
import { quickSortByProperty } from '@/utils/sort.utils';

export type Column<Item> = {
	name: string;
	key?: string;
	customClass?: ClassValue;
	type: "plainText" | "image" | "link";
	isSort?: boolean;
	customRender?: (item: Item, key: Column<Item>['key']) => string;
};

export type TableProps<DataTable> = {
	columns: Column<DataTable>[];
	data: DataTable[];
};

const TableCell = (type: Column<any>['type'], customClass: ClassValue = "", data: any) => {
	switch (type) {
		case "plainText":
			return <span className={cn("", customClass)}>{data}</span>;
		case "image":
			return <Image
				width={40}
				height={40}
				src={data}
				//unoptimized
				alt="table cell image"
				className={cn("", customClass)}
			/>;
		case "link":
			return <Link href={data} passHref className={cn("", customClass)}>{data}</Link>;
		default:
			return <span className={cn("", customClass)}>{data}</span>;
	}
}

const Table: FC<TableProps<RandomUserResponse['results'][number]>> = ({ columns, data }) => {
	const [generateId] = useUID();
	const [storedData, setStoredData] = useState<User[]>(data);
	const [flattenedData, setFlattenedData] = useState<Record<string, any>[]>([]);
	const [currentSort, setCurrentSort] = useState<{ key: string, order: 'ascending' | 'descending' }>({ key: 'name.title', order: 'ascending' });

	const toggleSortOrder = useCallback(() => {
		setCurrentSort((prev) => ({
			...prev,
			order: prev.order === 'ascending' ? 'descending' : 'ascending',
		}));
	}, []);

	const sortByKey = useCallback((key: string) => {
		if (key === currentSort.key) {
			toggleSortOrder();
		} else {
			setCurrentSort({ key, order: 'ascending' });
		}
	}, [flattenedData]);

	useEffect(() => {
		const sorted = quickSortByProperty(flattenedData, currentSort.key, currentSort.order);
		const parsed = sorted.map((item) => ObjectHelper.deFlattenObject(item));
		setStoredData(parsed as User[]);
		setFlattenedData(sorted);
	}, [currentSort]);

	useEffect(() => {
		const flatten = data.map(dataItem => ObjectHelper.flattenObject(dataItem));
		setStoredData(data);
		setFlattenedData(flatten);
	}, [data]);

	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
			<table className={"flex-grow w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-xl shadow-lg"}>
			<thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
				<tr>
					{columns.map((column) => (
						<th key={column.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
							<div className={"flex flex-row justify-start items-center gap-1"}>
								<span>{column.name}</span>
								{
									column.isSort && (
										<FaSort
											className="w-4 h-4 cursor-pointer hover:text-blue-600 hover:scale-110"
											onClick={() => sortByKey(column.key || "")}
										/>
									)
								}
							</div>
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{storedData.map((row, index) => (
					<tr key={generateId()} className="bg-white dark:bg-gray-900 border-b dark:border-gray-700">
						{columns.map((column) => (
							<td
								key={generateId()}
								className={cn(
									"px-6 py-2",
									{
										"flex justify-center": column.type === "image",
									}
								)} >
								{TableCell(
									column.type,
									column.customClass,
									column.customRender ?
										column.customRender(row, column.key) :
										(flattenedData[index]?.[column.key || ""] || (
											column.type === 'image' ? '/default-user.png' : "NULL"
										))
								)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
		</div>
	)
}

export default Table;