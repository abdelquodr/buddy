import { Camera, Mic, Paperclip, Smile } from "lucide-react";
import Image from "next/image";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function MessageComposer({
  value,
  onChange,
  onSubmit,
}: MessageComposerProps) {
  return (
    <form
      className="flex items-center gap-3 rounded-[20px] bg-[#d7d7d7] p-3 shadow-[0_10px_24px_rgba(17,24,39,0.06)]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <button
        type="button"
        aria-label="Voice message"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8a96a3] transition hover:text-brand-orange"
      >
        <Mic className="h-4 w-4" aria-hidden="true" />
      </button>

      <label className="flex min-w-0 flex-1 items-center rounded-full bg-white px-4 py-0">
        <span className="sr-only">Write a message</span>
        <input
          type="text"
          placeholder="Write Something..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm text-[#2b2f38] outline-none placeholder:text-[#c0c5cc]"
        />

        <button
          type="button"
          aria-label="Attach file"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8a96a3] transition hover:text-brand-orange"
        >
          <Paperclip className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Add image"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8a96a3] transition hover:text-brand-orange"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Insert emoji"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8a96a3] transition hover:text-brand-orange"
        >
          <Smile className="h-4 w-4" aria-hidden="true" />
        </button>
      </label>

      <button
        type="submit"
        aria-label="Send message"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_10px_20px_rgba(255,134,0,0.28)] transition hover:bg-brand-orange/90"
      >
        <Image
          src="/icons/send.svg"
          alt="send"
          className="w-5 h-5"
          width={4}
          height={4}
        />
      </button>
    </form>
  );
}
