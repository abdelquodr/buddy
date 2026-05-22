import type { ReactNode } from "react";

interface DashboardMetricProps {
  label: string;
  value: string;
  icon: ReactNode;
  tone?: "mint" | "violet" | "peach";
}

const toneStyles = {
  mint: "bg-[#dff9f5] text-[#2fb8a0]",
  violet: "bg-[#ece7ff] text-[#7c7cf4]",
  peach: "bg-[#fff0df] text-brand-orange",
};

export function DashboardMetric({
  label,
  value,
  icon,
  tone = "mint",
}: DashboardMetricProps) {
  return (
    <article className="flex items-center justify-between rounded-[18px] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(17,24,39,0.05)]">
      <div>
        <p className="text-3xl py-1 font-bold tracking-[-0.03em] text-[#2b2f38]">
          {value}
        </p>
        <p className="text-xs text-[#a0aab5]">{label}</p>
      </div>
      <div
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full",
          toneStyles[tone],
        ].join(" ")}
      >
        {icon}
      </div>
    </article>
  );
}
