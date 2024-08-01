"use client";
import Pagination from '@/components/pagination';
import UserTable from '@/components/userTable';

export default function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-between p-5">
      <div className={"flex flex-col items-center justify-center gap-5"}>
        <UserTable />
        <Pagination />
      </div>
    </main>
  );
}
