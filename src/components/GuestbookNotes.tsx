import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import type { GuestbookNote } from "@/lib/stats/guestbook";

/** "3 days ago" without pulling in a date library for one string. */
function timeAgo(iso: string) {
  const seconds = Math.max(1, (Date.now() - new Date(iso).getTime()) / 1000);
  // Each pair is [divisor, the unit you are left with AFTER dividing]. These
  // used to be labelled with the unit going IN, so every result came out one
  // step too small - a note posted 21 hours ago read "21 minutes ago" on the
  // homepage while giscus correctly said 21 hours.
  const steps: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "minute"],
    [60, "hour"],
    [24, "day"],
    [7, "week"],
    [4.345, "month"],
    [12, "year"],
  ];
  let value = seconds;
  let unit: Intl.RelativeTimeFormatUnit = "second";
  for (const [size, next] of steps) {
    if (value < size) break;
    value /= size;
    unit = next;
  }
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    -Math.round(value),
    unit,
  );
}

export function GuestbookNotes({ notes, total }: { notes: GuestbookNote[]; total: number }) {
  if (notes.length === 0) {
    return (
      <Link
        href="/guestbook"
        className="group flex flex-col items-center justify-center gap-2 rounded-[6px] border border-dashed border-black/15 py-8 transition-colors hover:border-black/30 dark:border-white/10 dark:hover:border-white/25"
      >
        <MessageSquare className="h-4 w-4 text-zinc-400 dark:text-zinc-600" aria-hidden="true" />
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400">
          No notes yet &mdash; be the first to sign.
        </p>
      </Link>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        {notes.slice(0, 4).map((note) => (
          <a
            key={note.url}
            href={note.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col gap-2 rounded-[6px] border border-black/5 bg-zinc-50 p-3.5 transition-colors hover:border-black/15 dark:border-white/5 dark:bg-[#09090b] dark:hover:border-white/15"
          >
            <div className="flex items-center gap-2">
              <Image
                src={note.avatar}
                alt=""
                width={22}
                height={22}
                className="rounded-full"
                unoptimized
              />
              <span className="text-[12.5px] font-semibold text-zinc-800 dark:text-zinc-200">
                {note.login}
              </span>
              <span className="ml-auto shrink-0 font-mono text-[10px] text-zinc-400 dark:text-zinc-600">
                {timeAgo(note.createdAt)}
              </span>
            </div>
            <p className="line-clamp-4 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
              {note.body}
            </p>
          </a>
        ))}
      </div>

      <Link
        href="/guestbook"
        className="inline-flex items-center justify-center gap-1.5 self-center rounded-[6px] border border-black/5 bg-zinc-50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400 transition-colors hover:text-zinc-700 dark:border-white/5 dark:bg-[#09090b] dark:text-zinc-600 dark:hover:text-zinc-300"
      >
        {total > 4 ? `Read all ${total} notes` : "Sign the guestbook"}
      </Link>
    </div>
  );
}
