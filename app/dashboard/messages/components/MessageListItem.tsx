import Image from "next/image";
import { IoCheckmarkSharp } from "react-icons/io5";

interface MessageListItemProps {
  name: string;
  preview: string;
  time: string;
  active?: boolean;
  unreadCount?: number;
  lastMessageSide?: "left" | "right";
  status?: "online" | "offline";
  avatarSrc: string;
  onClick?: () => void;
}

export function MessageListItem({
  name,
  preview,
  time,
  active = false,
  unreadCount = 0,
  lastMessageSide,
  status = "offline",
  avatarSrc,
  onClick,
}: MessageListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-start gap-3 rounded-[18px] px-3 py-3 text-left transition-all cursor-pointer relative",
        active
          ? "bg-white shadow-[0_12px_28px_rgba(17,24,39,0.06)] z-10"
          : "hover:bg-white hover:shadow-[0_12px_28px_rgba(17,24,39,0.06)]",
      ].join(" ")}
    >
      <div className="relative h-10 w-10 shrink-0 rounded-full bg-[#f1f5f9]">
        <Image src={avatarSrc} alt={name} fill className="object-cover" />
        {status === "online" ? (
          <span className="absolute -bottom-1 left-1 h-3.5 w-3.5 rounded-full bg-[#39d353] z-20" />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-[#2b2f38]">
            {name}
          </h3>
          <span className="shrink-0 text-[10px] text-[#c1c6cf]">{time}</span>
        </div>
        <p className="mt-1 truncate text-xs text-[#8a96a3]">{preview}</p>
      </div>

      {unreadCount > 0 ? (
        <span className="mt-2 inline-flex min-w-6 items-center justify-center rounded-full bg-brand-orange px-2 py-0.5 text-[11px] font-semibold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      ) : lastMessageSide === "right" ? (
        <span className="mt-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#DCE8FF] text-brand-orange">
          <IoCheckmarkSharp />
        </span>
      ) : null}
    </button>
  );
}
