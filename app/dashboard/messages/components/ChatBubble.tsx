import type { ReactNode } from "react";
import Image from "next/image";

interface ChatBubbleProps {
  side: "left" | "right";
  children: ReactNode;
  time?: string;
  avatarLabel: string;
  avatarSrc?: string;
}

export function ChatBubble({
  side,
  children,
  time,
  avatarLabel,
  avatarSrc,
}: ChatBubbleProps) {
  const isRight = side === "right";

  return (
    <div className={isRight ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isRight
            ? "flex max-w-[78%] flex-row-reverse items-end gap-2"
            : "flex max-w-[78%] items-end gap-2"
        }
      >
        <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-[#d8dde5] text-[10px] font-semibold text-[#5b6871]">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={avatarLabel}
              fill
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              {avatarLabel}
            </span>
          )}
        </div>
        <div className={isRight ? "text-right" : "text-left"}>
          <div
            className={[
              "inline-block rounded-2xl px-4 py-3 text-sm leading-5 shadow-[0_8px_18px_rgba(17,24,39,0.04)]",
              isRight
                ? "bg-[#fff6ee] text-brand-orange"
                : "bg-[#f2f3f5] text-[#4b5563]",
            ].join(" ")}
          >
            {children}
          </div>
          {time ? (
            <p className="mt-1 text-[10px] text-[#c1c6cf]">{time}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
