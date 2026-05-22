import Image from "next/image";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

interface LeftPanelProps {
  features?: string[];
}

function CheckIcon() {
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange"
      aria-hidden="true"
    >
      <svg
        width="10"
        height="8"
        viewBox="0 0 10 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 4L4 7L9 1"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function LeftPanel({
  features = [
    "Track real-time overview of company's financial performance.",
    "Track created projects budget against actual revenue and expenses.",
    "Highlighted reports on budget deficit and surplus, accounting dimensions, balance sheets and real-time sales margin estimation.",
  ],
}: LeftPanelProps) {
  return (
    <section className="relative hidden w-full flex-col items-center bg-white px-16 py-14 lg:flex">
      <div className="flex w-full max-w-md flex-1 flex-col justify-center gap-32 text-left">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Buddy"
            width={100}
            height={100}
            className="h-10 w-auto"
          />
          <span
            className={`${lexend.className} text-2xl font-bold text-[#2f2f3b]`}
          >
            Buddy
          </span>
        </div>

        <ul className="max-w-md space-y-12" role="list">
          {features.map((feature) => (
            <li key={feature} className="flex items-center my-3 gap-4">
              <CheckIcon />
              <p className="text-md leading-6 text-[#7b8593]">{feature}</p>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-xs text-[#a0aab5]">
          © 2022 Revvex. All rights reserved
        </p>
      </div>
    </section>
  );
}
