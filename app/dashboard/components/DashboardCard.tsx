import type { ReactNode } from "react";

interface DashboardCardProps {
  title?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function DashboardCard({
  title,
  action,
  className,
  children,
}: DashboardCardProps) {
  return (
    <section
      className={["dash-surface", className ?? ""].filter(Boolean).join(" ")}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title ? (
            <h2 className="text-xl font-bold tracking-[-0.03em] text-[#2b2f38]">
              {title}
            </h2>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
