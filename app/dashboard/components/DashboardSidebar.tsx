"use client";

import Link from "next/link";
import { Lexend } from "next/font/google";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { TrendingUp, LogOut, Mail } from "lucide-react";
import { LuUserRound, LuUsersRound } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { CiDollar } from "react-icons/ci";

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
});

const navItems = [
  { label: "My Portfolio", icon: LuUserRound, href: "/dashboard" },
  { label: "My Group", icon: LuUsersRound, href: "/dashboard/group" },
  { label: "Messages", icon: Mail, href: "/dashboard/messages" },
  { label: "Analytics", icon: TrendingUp, href: "/dashboard/analytics" },
  { label: "Pack", icon: CiDollar, href: "/dashboard/pack" },
  { label: "Settings", icon: IoSettingsOutline, href: "/dashboard/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={`${lexend.className} flex h-full justify-center items-center flex-col bg-white px py-5 shadow-[0_12px_34px_rgba(17,24,39,0.06)]`}
    >
      <div className="flex w-full flex-col items-center space-y-10">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 px-3 pt-1"
        >
          <Image
            src="/logo.svg"
            alt="Buddy"
            width={100}
            height={100}
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold tracking-[-0.03em] text-[#2b2f38]">
            Buddy
          </span>
        </Link>

        <nav
          aria-label="Dashboard navigation"
          className="w-full max-w- space-y-2"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="group relative flex w-full items-center gap-3 rounded-[18px] px-8 py-1.5 text-sm font-medium transition"
              >
                <nav
                  className={`flex w-full items-center gap-3 px-12 py-3.5 rounded-lg ${
                    isActive
                      ? "bg-white text-brand-orange shadow-[0_12px_28px_rgba(17,24,39,0.06)]"
                      : "text-[#8a96a3] hover:bg-[#f7f8fc] hover:text-[#4b505a]"
                  }
                    `}
                >
                  {isActive ? (
                    <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-brand-orange" />
                  ) : null}
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="">{item.label}</span>
                </nav>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto w-full px-6 pt-6">
        <div className="relative overflow-hidden rounded-[26px] bg-white p-4 shadow-[0_12px_28px_rgba(17,24,39,0.06)]">
          <div className="absolute inset-x-0 top-0 h-12" />
          <div className="relative flex flex-col items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-4 ring-white shadow-[0_8px_18px_rgba(17,24,39,0.12)]">
              <Image
                src="/img/base_user.png"
                alt="Theresa milly"
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#2b2f38]">
                Theresa milly
              </p>
              <p className="text-xs text-[#8a96a3]">Influencer</p>
            </div>
          </div>

          <button
            type="button"
            className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#fff1df] px-4 py-3 text-sm font-semibold text-brand-orange transition hover:bg-[#ffe7c3]"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
