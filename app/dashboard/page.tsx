import { ArrowDown, ArrowUp, TrendingUp, UserRound } from "lucide-react";
import { IoIosHeart } from "react-icons/io";
import Image from "next/image";

import { DashboardCard } from "./components/DashboardCard";
import { DashboardMetric } from "./components/DashboardMetric";
import { DashboardTopbar } from "./components/DashboardTopbar";

const watchlistItems = [
  { symbol: "AAPL", change: "+0.47%", trend: "up" },
  { symbol: "BPL", change: "-0.78%", trend: "down" },
];

const revenueItems = [
  { label: "$4,000", sublabel: "Recently Added Pages", tone: "facebook" },
  { label: "$2,120", sublabel: "Video Monetization", tone: "instagram" },
  { label: "$1,752", sublabel: "Community Buildup", tone: "linkedin" },
];

const newsItems = [
  {
    title: "Russia & Ukraine War",
    description: "Marketing is evolving. It's chang...",
    image: "/img/trending-1.png",
  },
  {
    title: "Elon Musk bought Twitter",
    description: "Twitter is the most useful social pl...",
    image: "/img/trendimg-2.png",
  },
  {
    title: "Fuel Crisis Everywhere",
    description: "Due to covid situation in 2020 the...",
    image: "/img/trending-3.png",
  },
];

const memberItems = [
  {
    name: "Wanda Parker",
    tag: "@dshking1234",
    percent: "10.3%",
    avatar: "/img/pic-1.png",
  },
  {
    name: "Terry Brown",
    tag: "@dshking1234",
    percent: "9.8%",
    avatar: "/img/pic-2.png",
  },
  {
    name: "Lucas Holmes",
    tag: "@dshking1234",
    percent: "6.5%",
    avatar: "/img/pic-3.png",
  },
  {
    name: "Janice Miller",
    tag: "@dshking1234",
    percent: "8.6%",
    avatar: "/img/pic-4.png",
  },
  {
    name: "Terry Brown",
    tag: "@dshking1234",
    percent: "9.8%",
    avatar: "/img/pic-5.png",
  },
];

function MiniAvatar({ src, name }: { src: string; name: string }) {
  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#f3f5f8] ring-4 ring-white">
      <Image src={src} alt={name} fill className="object-cover" />
    </div>
  );
}

function OverviewChart() {
  const bars = [55, 68, 40, 52, 45, 60, 85, 48, 38, 70, 44, 58];
  const labels = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const yAxisLabels = [
    { value: "1000", y: 20 },
    { value: "800", y: 60 },
    { value: "600", y: 100 },
    { value: "400", y: 140 },
    { value: "200", y: 180 },
    { value: "0", y: 220 },
  ];

  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_14px_30px_rgba(17,24,39,0.05)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-[-0.03em] text-[#2b2f38]">
          Overview
        </h2>
        <div className="flex gap-2 text-xs font-semibold">
          {[
            ["Robin Hood", true],
            ["Ameitrade", false],
            ["Fidelity", false],
            ["Charles", false],
          ].map(([label, active]) => (
            <button
              key={String(label)}
              type="button"
              className={[
                "rounded-full px-4 py-2 transition",
                active
                  ? "bg-brand-orange text-white"
                  : "bg-[#f2f3f5] text-[#8a96a3]",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

      </div>

      <div className="rounded-[18px] bg-[#fcfcfc] px-4 pb-5 pt-4">
        <svg
          viewBox="0 0 1000 260"
          className="h-60 w-full"
          role="img"
          aria-label="Monthly overview chart"
        >
          <defs>
            <linearGradient id="highlightBar" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#FF8600" />
              <stop offset="100%" stopColor="#FFB14D" />
            </linearGradient>
          </defs>

          {[40, 80, 120, 160, 200].map((line) => (
            <line
              key={line}
              x1="36"
              x2="1000"
              y1={line}
              y2={line}
              stroke="#e9edf3"
              strokeDasharray="4 6"
            />
          ))}

          {yAxisLabels.map((item) => (
            <text
              key={item.value}
              x="0"
              y={item.y}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-[#a0aab5] text-[11px] font-medium"
            >
              {item.value}
            </text>
          ))}

          {bars.map((height, index) => {
            const isHighlight = index === 6;
            const x = 32 + index * 82;
            const barHeight = (height / 100) * 170;
            const y = 190 - barHeight;

            return (
              <g key={labels[index]}>
                <rect
                  x={x}
                  y={y}
                  width="16"
                  height={barHeight}
                  rx="2"
                  fill={isHighlight ? "#FFB800" : "#e4e7ec"}
                />
                {isHighlight ? (
                  <rect
                    x={x + 18}
                    y={y + 16}
                    width="16"
                    height={Math.max(barHeight - 16, 24)}
                    rx="2"
                    fill="#FF8600"
                    opacity="0.7"
                  />
                ) : null}
                <text
                  x={x + 11}
                  y="225"
                  textAnchor="middle"
                  className="fill-[#a0aab5] text-[11px] font-medium"
                >
                  {labels[index]}
                </text>
              </g>
            );
          })}
        </svg>

      </div>
    </div>
  );
}

function TrendingPosts() {
  const posts = [
    {
      title: "8 Upcoming Influencer Marketing Trends and Benefits",
      excerpt:
        "Marketing is evolving. It's changing from a one-way street to a two-way conversa...",
    },
    {
      title: "How Influencer Marketing Affects Consumer Buying Behavior",
      excerpt:
        "As influencer marketing continues to grow, consumers have been turning to their...",
    },
  ];

  return (
    <DashboardCard title="Trending Posts">
      <div className="grid gap-4 lg:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.title}
            className="rounded-2xl border border-[#edf0f4] p-4"
          >
            <h3 className="text-base font-semibold leading-6 tracking-[-0.02em] text-[#2b2f38]">
              {post.title}
            </h3>
            <p className="mt-2 text-xs leading-5 text-[#8a96a3]">
              {post.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-4 text-xs text-[#8a96a3]">
              <span className="flex items-center gap-1 bg-gray-100 py-1 px-2 rounded-full">
                <IoIosHeart
                  className="h-3.5 w-3.5 text-red-500"
                  aria-hidden="true"
                />
                260
              </span>
              <span className="flex items-center gap-1 bg-gray-100 py-1 px-2 rounded-full">
                <Image
                  src="/icons/message.svg"
                  className="h-3.5 w-3.5"
                  alt="message"
                  width={4}
                  height="4"
                />
                234
              </span>
              <span className="flex items-center gap-1 bg-gray-100 py-1 px-2 rounded-full">
                <Image
                  src="/icons/route.svg"
                  className="h-3.5 w-3.5"
                  alt="message"
                  width={4}
                  height="4"
                />
                123
              </span>
            </div>
          </article>
        ))}
      </div>
    </DashboardCard>
  );
}

function PotentialMembers() {
  return (
    <DashboardCard title="Potential Members">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {memberItems.map((member, index) => (
          <article
            key={member.name + index}
            className="rounded-2xl border border-[#edf0f4] p-4 text-center"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#f3f5f8]">
              <MiniAvatar src={member.avatar} name={member.name} />
            </div>
            <h3 className="text-sm font-semibold text-[#2b2f38]">
              {member.name}
            </h3>
            <p className="text-[11px] text-[#a0aab5]">{member.tag}</p>
            <p className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-[#35DB95]">
              <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
              {member.percent}
            </p>
          </article>
        ))}
      </div>
    </DashboardCard>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardTopbar title="My Portfolio" />

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <DashboardMetric
              value="51"
              label="Total Channels"
              tone="mint"
              icon={
                <Image
                  src="/icons/circle-layer.svg"
                  className="h-5 w-5"
                  alt="circle"
                  width={4}
                  height="4"
                />
              }
            />
            <DashboardMetric
              value="125"
              label="New Members"
              tone="violet"
              icon={<UserRound className="h-4 w-4" aria-hidden="true" />}
            />
            <DashboardMetric
              value="789"
              label="All Impressions"
              tone="peach"
              icon={<TrendingUp className="h-4 w-4" aria-hidden="true" />}
            />
          </div>

          <OverviewChart />
          <TrendingPosts />
          <PotentialMembers />
        </div>

        <div className="space-y-4">
          <DashboardCard
            title="Watchlist"
            action={
              <button
                type="button"
                className="text-xs font-semibold text-brand-orange"
              >
                VIEW ALL
              </button>
            }
          >
            <div className="space-y-3">
              {watchlistItems.map((item) => (
                <article
                  key={item.symbol}
                  className="rounded-2xl bg-[#F6F6F6] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-8">
                        <h3 className="text-base font-semibold text-[#2b2f38]">
                          {item.symbol}
                        </h3>
                        {item.trend === "up" ? (
                          <ArrowUp
                            className="h-4 w-4 text-[#35DB95]"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowDown
                            className="h-4 w-4 text-red-500"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[#8a96a3]">$142.90</p>
                      <p
                        className={[
                          "mt-1 text-xs font-semibold",
                          item.trend === "up"
                            ? "text-[#35DB95]"
                            : "text-red-500",
                        ].join(" ")}
                      >
                        {item.change}
                      </p>
                    </div>
                    <svg
                      className="h-14 w-45"
                      viewBox="0 0 180 56"
                      role="img"
                      aria-hidden="true"
                    >
                      <rect
                        x="0"
                        y="0"
                        width="180"
                        height="56"
                        rx="12"
                        fill="#FBFBFC"
                      />
                      <line
                        x1="8"
                        x2="172"
                        y1="28"
                        y2="28"
                        stroke="#e9edf3"
                        strokeDasharray="3 4"
                      />
                      <path
                        d="M8 34 C28 28, 48 24, 70 26 C92 28, 116 22, 144 20 C156 19, 164 20, 170 18"
                        fill="none"
                        stroke="#FFB800"
                        strokeWidth="1.5"
                        strokeLinecap="butt"
                        strokeLinejoin="miter"
                      />
                      <circle
                        cx="170"
                        cy="18"
                        r="3.2"
                        fill="#FFB800"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </article>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Revenue">
            <div className="space-y-3">
              {revenueItems.map((item) => (
                <article
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-[#edf0f4] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#2b2f38]">
                      {item.label}
                    </p>
                    <p className="text-xs text-[#8a96a3]">{item.sublabel}</p>
                  </div>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${item.tone === "facebook" ? "bg-[#1773EA14]" : ""} ${item.tone === "instagram" ? "bg-[#EB334814]" : ""} ${item.tone === "linkedin" ? "bg-[#2764AC14]" : ""}`}
                  >
                    {item.tone === "facebook" && (
                      <Image
                        src="/socials/facebook.svg"
                        alt="Facebook"
                        width={16}
                        height={16}
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    )}
                    {item.tone === "instagram" && (
                      <Image
                        src="/socials/instagram.svg"
                        alt="Instagram"
                        width={16}
                        height={16}
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    )}
                    {item.tone === "linkedin" && (
                      <Image
                        src="/socials/linkedin.svg"
                        alt="LinkedIn"
                        width={16}
                        height={16}
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Trending News">
            <div className="space-y-3">
              {newsItems.map((item, index) => (
                <article
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-[#edf0f4] p-2.5"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#f3f5f8]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-[#2b2f38]">
                      {item.title}
                    </h3>
                    <p className="truncate text-xs text-[#8a96a3]">
                      {item.description}
                    </p>
                  </div>
                  {index === 0 && (
                    <span
                      className="ml-auto h-2 w-2 rounded-full bg-brand-orange"
                      aria-hidden="true"
                    />
                  )}
                </article>
              ))}
            </div>
          </DashboardCard>
        </div>
      </section>
    </div>
  );
}
