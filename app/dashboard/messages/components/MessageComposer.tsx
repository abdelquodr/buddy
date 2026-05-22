import { Camera, Mic, Paperclip, Smile } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface MessageComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFile?: (file: File, dataUrl: string) => void;
  onImage?: (file: File, dataUrl: string) => void;
  onEmoji?: (emoji: string) => void;
}

const EMOJIS = [
  "😀",
  "😄",
  "😍",
  "🤣",
  "😎",
  "🤔",
  "👍",
  "🎉",
  "🙏",
  "🔥",
  "😅",
  "🙌",
];

export function MessageComposer({
  value,
  onChange,
  onSubmit,
  onFile,
  onImage,
  onEmoji,
}: MessageComposerProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });

  return (
    <form
      className="relative flex items-center gap-3 rounded-[20px] bg-[#d7d7d7] p-3 shadow-[0_10px_24px_rgba(17,24,39,0.06)]"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <button
        type="button"
        aria-label="Voice message"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8a96a3] transition hover:text-brand-orange cursor-pointer"
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

        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const dataUrl = await readFileAsDataUrl(file);
            onFile?.(file, dataUrl);
            e.currentTarget.value = "";
          }}
        />

        <button
          type="button"
          aria-label="Attach file"
          onClick={() => fileRef.current?.click()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8a96a3] transition hover:text-brand-orange cursor-pointer"
        >
          <Paperclip className="h-4 w-4" aria-hidden="true" />
        </button>

        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const dataUrl = await readFileAsDataUrl(file);
            onImage?.(file, dataUrl);
            e.currentTarget.value = "";
          }}
        />

        <button
          type="button"
          aria-label="Add image"
          onClick={() => imageRef.current?.click()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8a96a3] transition hover:text-brand-orange cursor-pointer"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Insert emoji"
            onClick={() => setEmojiOpen((s) => !s)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8a96a3] transition hover:text-brand-orange cursor-pointer"
          >
            <Smile className="h-4 w-4" aria-hidden="true" />
          </button>

          {emojiOpen ? (
            <div className="absolute right-0 bottom-full mb-2 w-44 rounded-lg border border-[#e6e9ef] bg-white p-2 shadow-[0_12px_28px_rgba(17,24,39,0.06)]">
              <div className="grid grid-cols-6 gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    type="button"
                    onClick={() => {
                      onEmoji?.(e);
                      setEmojiOpen(false);
                    }}
                    className="h-8 w-8 rounded-md text-lg leading-6 hover:bg-[#f3f4f6]"
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </label>

      <button
        type="submit"
        aria-label="Send message"
        className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-orange text-white shadow-[0_10px_20px_rgba(255,134,0,0.28)] transition hover:bg-brand-orange/90 cursor-pointer"
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
