import { Plus } from "lucide-react";
import Image from "next/image";

interface DashboardTopbarProps {
  title: string;
}

export function DashboardTopbar({ title }: DashboardTopbarProps) {
  return (
    <header className="flex items-center pt-7 justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.04em] text-[#2b2f38]">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <label className="relative hidden w-120 items-center lg:flex">
          <Image
            src="/icons/search.svg"
            className="h-5 w-5 absolute left-3"
            alt="search"
            width={4}
            height="4"
          />
          <input
            type="search"
            placeholder="Search"
            aria-label="Search dashboard"
            className="h-11 w-full rounded-[18px] border border-transparent bg-white pl-11 pr-4 text-sm text-[#2b2f38] shadow-[0_10px_24px_rgba(17,24,39,0.06)] outline-none placeholder:text-[#a0aab5] focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
          />
        </label>

        <button
          type="button"
          aria-label="Add new item"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2b2f38] shadow-[0_10px_24px_rgba(17,24,39,0.06)] transition hover:text-brand-orange"
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#2b2f38] shadow-[0_10px_24px_rgba(17,24,39,0.06)] transition hover:text-brand-orange"
        >
          <Image
            src="/icons/bell.svg"
            className="h-5 w-5"
            alt="bell"
            width={4}
            height="4"
          />
          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
      </div>
    </header>
  );
}
