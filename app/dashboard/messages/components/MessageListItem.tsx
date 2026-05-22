import Image from "next/image";

interface MessageListItemProps {
  name: string;
  preview: string;
  time: string;
  active?: boolean;
  unread?: boolean;
  status?: "online" | "offline";
  avatarSrc: string;
  onClick?: () => void;
}

export function MessageListItem({
  name,
  preview,
  time,
  active = false,
  unread = false,
  status = "offline",
  avatarSrc,
  onClick,
}: MessageListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-start gap-3 rounded-[18px] px-3 py-3 text-left transition-all",
        active
          ? "bg-white shadow-[0_12px_28px_rgba(17,24,39,0.06)]"
          : "hover:bg-white hover:shadow-[0_12px_28px_rgba(17,24,39,0.06)]",
      ].join(" ")}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#f1f5f9]">
        <Image src={avatarSrc} alt={name} fill className="object-cover" />
        {status === "online" ? (
          <span className="absolute bottom-0 left-0 h-3 w-3 rounded-full border-2 border-white bg-[#39d353]" />
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

      {unread ? (
        <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-orange" />
      ) : null}
    </button>
  );
}
