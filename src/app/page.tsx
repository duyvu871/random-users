"use client";
import Pagination from '@/components/pagination';
import UserTable from '@/components/userTable';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5">
      <div className={"flex-1 flex flex-col items-center justify-center gap-5"}>
        <UserTable />
        <Pagination />
      </div>
    </main>
  );
}
