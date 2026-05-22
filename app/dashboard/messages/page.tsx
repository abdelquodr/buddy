"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, PencilLine, Search } from "lucide-react";

import { DashboardCard } from "../components/DashboardCard";
import { DashboardTopbar } from "../components/DashboardTopbar";
import { ChatBubble } from "./components/ChatBubble";
import { MessageComposer } from "./components/MessageComposer";
import { MessageListItem } from "./components/MessageListItem";

type ContactSeed = {
  name: string;
  role?: string;
  status?: "online" | "offline";
  unread?: boolean;
  avatarSrc: string;
};

type ChatMessage = {
  id: string;
  side: "left" | "right";
  time: string;
  avatarLabel: string;
  avatarSrc: string;
  kind: "text" | "file";
  text?: string;
  fileLabel?: string;
  fileSrc?: string;
};

type ChatState = {
  selectedContact: string;
  unreadByContact: Record<string, boolean>;
  threads: Record<string, ChatMessage[]>;
};

const STORAGE_KEY = "buddy-dashboard-messages-state";

const currentUser = {
  name: "David Peters",
  role: "Senior Developer",
  avatarSrc: "/img/base_user.png",
  avatarLabel: "DP",
};

const contactsSeed: ContactSeed[] = [
  {
    name: "Lisa Roy",
    role: "Project Manager",
    status: "online",
    unread: false,
    avatarSrc: "/img/pic-1.png",
  },
  {
    name: "Jamie Taylor",
    role: "Content Strategist",
    unread: true,
    avatarSrc: "/img/pic-2.png",
  },
  {
    name: "Jason Roy",
    role: "Product Designer",
    avatarSrc: "/img/pic-3.png",
  },
  {
    name: "Amy Frost",
    role: "Frontend Engineer",
    avatarSrc: "/img/pic-4.png",
  },
  {
    name: "Paul Wilson",
    role: "QA Lead",
    avatarSrc: "/img/pic-5.png",
  },
  {
    name: "Ana Williams",
    role: "Support Specialist",
    unread: true,
    avatarSrc: "/img/base_user.png",
  },
];

const initialThreads: Record<string, ChatMessage[]> = {
  "Lisa Roy": [
    {
      id: "lisa-1",
      side: "left",
      time: "10:12 AM",
      avatarLabel: "LR",
      avatarSrc: "/img/pic-1.png",
      kind: "text",
      text: "Hi David, have you got the project report pdf?",
    },
    {
      id: "lisa-2",
      side: "right",
      time: "10:14 AM",
      avatarLabel: "DP",
      avatarSrc: "/img/base_user.png",
      kind: "text",
      text: "No, I did not get it",
    },
    {
      id: "lisa-3",
      side: "left",
      time: "Yesterday",
      avatarLabel: "LR",
      avatarSrc: "/img/pic-1.png",
      kind: "text",
      text: "Ok, I will just send it here. Plz be sure to fill the details by today end of the day.",
    },
    {
      id: "lisa-4",
      side: "left",
      time: "Yesterday",
      avatarLabel: "LR",
      avatarSrc: "/img/pic-1.png",
      kind: "file",
      fileLabel: "project_report.pdf",
      fileSrc: "/img/trending-1.png",
    },
    {
      id: "lisa-5",
      side: "right",
      time: "Yesterday",
      avatarLabel: "DP",
      avatarSrc: "/img/base_user.png",
      kind: "text",
      text: "Ok. Should I send it over email as well after filling the details?",
    },
    {
      id: "lisa-6",
      side: "left",
      time: "Yesterday",
      avatarLabel: "LR",
      avatarSrc: "/img/pic-1.png",
      kind: "text",
      text: "Ya. I&apos;ll be adding more team members to it.",
    },
    {
      id: "lisa-7",
      side: "right",
      time: "Yesterday",
      avatarLabel: "DP",
      avatarSrc: "/img/base_user.png",
      kind: "text",
      text: "OK",
    },
  ],
  "Jamie Taylor": [
    {
      id: "jamie-1",
      side: "left",
      time: "10:35 AM",
      avatarLabel: "JT",
      avatarSrc: "/img/pic-2.png",
      kind: "text",
      text: "Nice One. Will Do it tomorrow",
    },
  ],
  "Jason Roy": [
    {
      id: "jason-1",
      side: "left",
      time: "09:15 AM",
      avatarLabel: "JR",
      avatarSrc: "/img/pic-3.png",
      kind: "text",
      text: "That's Great. I am looking forward to having a great start.",
    },
  ],
  "Amy Frost": [
    {
      id: "amy-1",
      side: "left",
      time: "Yesterday",
      avatarLabel: "AF",
      avatarSrc: "/img/pic-4.png",
      kind: "text",
      text: "I will start working on the chat app right now",
    },
  ],
  "Paul Wilson": [
    {
      id: "paul-1",
      side: "left",
      time: "Yesterday",
      avatarLabel: "PW",
      avatarSrc: "/img/pic-5.png",
      kind: "text",
      text: "See you tomorrow champ",
    },
  ],
  "Ana Williams": [
    {
      id: "ana-1",
      side: "left",
      time: "Yesterday",
      avatarLabel: "AW",
      avatarSrc: "/img/base_user.png",
      kind: "text",
      text: "??",
    },
  ],
};

function createInitialState(): ChatState {
  return {
    selectedContact: "Lisa Roy",
    unreadByContact: {
      "Lisa Roy": false,
      "Jamie Taylor": true,
      "Jason Roy": false,
      "Amy Frost": false,
      "Paul Wilson": false,
      "Ana Williams": true,
    },
    threads: initialThreads,
  };
}

function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function toPreview(message: ChatMessage | undefined) {
  if (!message) {
    return "No messages yet";
  }

  if (message.kind === "file") {
    return `Shared ${message.fileLabel ?? "a file"}`;
  }

  return message.text ?? "";
}

export default function MessagesPage() {
  const [state, setState] = useState<ChatState>(createInitialState);
  const [draft, setDraft] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState((current) => {
          try {
            const parsed = JSON.parse(stored) as Partial<ChatState>;
            if (!parsed.threads || !parsed.selectedContact) {
              return current;
            }

            return {
              selectedContact: parsed.selectedContact,
              unreadByContact: {
                ...current.unreadByContact,
                ...(parsed.unreadByContact ?? {}),
              },
              threads: {
                ...current.threads,
                ...(parsed.threads ?? {}),
              },
            };
          } catch {
            return current;
          }
        });
      }
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const contacts = useMemo(() => {
    return contactsSeed.map((contact) => {
      const thread = state.threads[contact.name] ?? [];
      const lastMessage = thread[thread.length - 1];

      return {
        ...contact,
        active: contact.name === state.selectedContact,
        unread: state.unreadByContact[contact.name] ?? contact.unread ?? false,
        preview: toPreview(lastMessage),
        time: lastMessage?.time ?? "10:35 AM",
      };
    });
  }, [state.selectedContact, state.threads, state.unreadByContact]);

  const filteredContacts = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return contacts;
    }

    return contacts.filter((contact) => {
      const searchableText = [
        contact.name,
        contact.role ?? "",
        contact.preview,
        contact.time,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedTerm);
    });
  }, [contacts, searchTerm]);

  const activeContact =
    contacts.find((contact) => contact.active) ?? contacts[0];
  const activeMessages = state.threads[state.selectedContact] ?? [];

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeMessages.length, state.selectedContact]);

  const selectContact = (name: string) => {
    setState((current) => ({
      ...current,
      selectedContact: name,
      unreadByContact: {
        ...current.unreadByContact,
        [name]: false,
      },
    }));
    setDraft("");
  };

  const sendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) {
      return;
    }

    setState((current) => {
      const thread = current.threads[current.selectedContact] ?? [];
      const nextMessage: ChatMessage = {
        id: `${current.selectedContact.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        side: "right",
        time: formatTime(),
        avatarLabel: currentUser.avatarLabel,
        avatarSrc: currentUser.avatarSrc,
        kind: "text",
        text: trimmed,
      };

      return {
        ...current,
        unreadByContact: {
          ...current.unreadByContact,
          [current.selectedContact]: false,
        },
        threads: {
          ...current.threads,
          [current.selectedContact]: [...thread, nextMessage],
        },
      };
    });

    setDraft("");
  };

  return (
    <>
      <DashboardTopbar title="Messages" />

      <section className="grid min-h-[calc(100vh-10rem)] bg-white p-6 gap-6 rounde-md  xl:grid-cols-[320px_minmax(0,1fr)]">
        <DashboardCard className="flex min-h-0 flex-col bg-[#f7f8fc] shadow-[0_12px_28px_rgba(17,24,39,0.06)] overflow-hidden p-0">
          <div className="border-b border-[#edf0f4] p-5 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[#f1f5f9]">
                  <Image
                    src={currentUser.avatarSrc}
                    alt={currentUser.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-brand-orange">
                    {currentUser.name}
                  </h2>
                  <p className="text-[11px] text-[#8a96a3]">
                    {currentUser.role}
                  </p>
                </div>
              </div>

              <button
                type="button"
                aria-label="Compose new message"
                className="text-[#8a96a3] transition hover:text-brand-orange"
              >
                <PencilLine className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <label className="mt-4 flex items-center rounded-full bg-[#f7f8fb] px-4 py-3">
              <Search
                className="mr-2 h-4 w-4 text-[#c1c6cf]"
                aria-hidden="true"
              />
              <span className="sr-only">Search contacts</span>
              <input
                type="search"
                placeholder="Search Here..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full bg-transparent text-sm text-[#2b2f38] outline-none placeholder:text-[#c1c6cf]"
              />
            </label>
          </div>

          <div className="space-y-2 p-3">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <MessageListItem
                  key={contact.name}
                  name={contact.name}
                  preview={contact.preview}
                  time={contact.time}
                  active={contact.active}
                  unread={contact.unread}
                  status={contact.status}
                  avatarSrc={contact.avatarSrc}
                  onClick={() => selectContact(contact.name)}
                />
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-[#e5e7eb] bg-white px-4 py-6 text-center text-sm text-[#8a96a3] shadow-[0_12px_28px_rgba(17,24,39,0.04)]">
                No contacts match your search.
              </div>
            )}
          </div>
        </DashboardCard>

        <DashboardCard className="flex h-full min-h-0 bg-[#f7f8fc] shadow-[0_12px_28px_rgba(17,24,39,0.06)] flex-col overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-[#edf0f4] p-5">
            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full bg-[#f1f5f9]">
                <Image
                  src={activeContact.avatarSrc}
                  alt={activeContact.name}
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#39d353]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-[#2b2f38]">
                  {activeContact.name}
                </h2>
                <p className="text-[11px] text-[#8a96a3]">
                  {activeContact.status === "online" ? "Online" : "Offline"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[#8a96a3]">
              <button
                type="button"
                aria-label="Search conversation"
                className="transition hover:text-brand-orange"
              >
                <Search className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Favorite conversation"
                className="transition hover:text-brand-orange"
              >
                <Heart className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Conversation notifications"
                className="transition hover:text-brand-orange"
              >
                <Image
                  alt="notifications"
                  src="/icons/bell-chart.svg"
                  className="h-5 w-5"
                  width={10}
                  height={10}
                />
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col space-y-6 overflow-y-auto p-5 lg:p-6">
            {activeMessages.map((message) => {
              if (message.kind === "file") {
                return (
                  <div key={message.id} className="flex items-start gap-2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#f1f5f9]">
                      <Image
                        src={message.avatarSrc}
                        alt={message.avatarLabel}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="rounded-2xl border border-[#edf0f4] bg-[#f8f9fb] p-2 shadow-[0_8px_18px_rgba(17,24,39,0.03)]">
                      <div className="relative h-16 w-28 overflow-hidden rounded-xl bg-[#e5e7eb]">
                        <Image
                          src={message.fileSrc ?? "/img/trending-1.png"}
                          alt={message.fileLabel ?? "Shared file"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="mt-1 text-xs text-[#4b5563]">
                        {message.fileLabel}
                      </p>
                    </div>
                  </div>
                );
              }

              return (
                <ChatBubble
                  key={message.id}
                  side={message.side}
                  avatarLabel={message.avatarLabel}
                  avatarSrc={message.avatarSrc}
                  time={message.time}
                >
                  {message.text}
                </ChatBubble>
              );
            })}
            <div ref={messageEndRef} />

            <div className="mt-auto shrink-0 pt-2">
              <MessageComposer
                value={draft}
                onChange={setDraft}
                onSubmit={sendMessage}
              />
            </div>
          </div>
        </DashboardCard>
      </section>
    </>
  );
}
