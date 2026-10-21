"use client";

import { useState } from "react";
import { hackathonsData } from "@/data/hackathonsData";

const dashedX = {
  maskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
} as const;

/**
 * The summary - event, placement, dates, organiser and the metric row - stays
 * open; the write-up, stack, team and links fold away. The cards carry a lot of
 * prose, and two of them fully expanded pushed everything below the fold.
 *
 * Same open/close mechanics as ExperienceList (a 0fr -> 1fr grid row, so the
 * height animates without measuring anything), but driven by a real <button>
 * with aria-expanded so it works from the keyboard.
 */
export function Hackathons() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="relative pt-6 pb-2 flex flex-col gap-5">
      {hackathonsData.map((h) => {
        const isOpen = openId === h.id;
        return (
          <div key={h.id} className="relative group">
            <div className="absolute -inset-[5px] rounded-[11px] border border-black/5 dark:border-white/5 pointer-events-none transition-colors duration-300 group-hover:border-black/10 dark:group-hover:border-white/10" />
            <article className="relative flex flex-col rounded-[6px] overflow-hidden bg-zinc-50 dark:bg-[#09090b] border border-black/5 dark:border-white/5 shadow-sm shadow-black/5 dark:shadow-lg dark:shadow-black/80">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : h.id)}
                className="w-full cursor-pointer text-left transition-colors hover:bg-zinc-100/60 dark:hover:bg-zinc-900/30"
              >
                <header className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-3 pb-2.5">
                  <h3 className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 tracking-tight sm:text-[15px]">
                    {h.event}
                  </h3>
                  <span className="px-1.5 py-[1px] rounded-[4px] text-[11px] font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-300/50 dark:border-zinc-700/50 whitespace-nowrap">
                    {h.placement}
                  </span>
                  <span className="ml-auto flex items-center gap-2 text-[12px] font-medium text-zinc-400 dark:text-zinc-600 whitespace-nowrap">
                    {h.dates}
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </header>

                <p className="px-4 pb-3 text-left text-[12px] text-zinc-500 dark:text-zinc-500">
                  {h.organizer}
                </p>
              </button>

              <div className="h-px bg-black/30 dark:bg-white/[0.15]" style={dashedX} />

              {/* the numbers stay out: they are the reason to open the card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 py-1">
                {h.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="relative min-w-0 px-3 py-2 after:absolute after:bottom-0 after:right-0 after:top-0 after:w-0 after:border-r after:border-black/30 after:[mask-image:repeating-linear-gradient(to_bottom,black_0,black_1px,transparent_1px,transparent_6px)] dark:after:border-white/[0.15] [&:nth-child(2n)]:after:hidden sm:[&:not(:last-child)]:after:block sm:[&:last-child]:after:hidden"
                  >
                    <p className="whitespace-nowrap text-[16px] font-bold leading-none text-zinc-900 dark:text-zinc-100">
                      {m.value}
                    </p>
                    <p className="mt-1 text-[10px] font-medium uppercase text-zinc-400 dark:text-zinc-600">
                      {m.label}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`transition-opacity duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isOpen ? "opacity-100" : "opacity-0"}`}
                  >
                    <div className="h-px bg-black/30 dark:bg-white/[0.15]" style={dashedX} />

                    <div className="px-4 py-3.5 flex flex-col gap-3">
                      <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {h.problem}
                      </p>

                      <div>
                        <p className="text-[10px] font-medium uppercase text-zinc-400 dark:text-zinc-600">
                          {h.project}
                        </p>
                        <ul className="mt-2 flex flex-col gap-1.5">
                          {h.built.map((b) => (
                            <li
                              key={b}
                              className="flex gap-1.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400"
                            >
                              <span aria-hidden="true">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {h.principle && (
                        <blockquote className="border-l-2 border-black/20 dark:border-white/20 pl-3 text-[13px] leading-relaxed italic text-zinc-500 dark:text-zinc-400">
                          {h.principle}
                        </blockquote>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {h.tech.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 bg-zinc-100 dark:bg-[#0a0a0a] border border-black/30 dark:border-white/[0.15] rounded-[6px] text-[12px] font-medium text-zinc-600 dark:text-zinc-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {(h.team?.length || h.links?.length) && (
                      <>
                        <div className="h-px bg-black/30 dark:bg-white/[0.15]" style={dashedX} />
                        <footer className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3">
                          {h.team?.length ? (
                            <p className="text-[12px] text-zinc-500 dark:text-zinc-500">
                              Built with {h.team.join(", ")}
                            </p>
                          ) : null}
                          <div className="ml-auto flex flex-wrap gap-4">
                            {h.links?.map((l) => (
                              <a
                                key={l.href}
                                href={l.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                // the panel is inert while closed, so a collapsed
                                // card cannot hand focus to an invisible link
                                tabIndex={isOpen ? undefined : -1}
                                className="flex items-center gap-1 text-[12px] font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                              >
                                {l.label}
                                <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <line x1="7" y1="17" x2="17" y2="7" />
                                  <polyline points="7 7 17 7 17 17" />
                                </svg>
                              </a>
                            ))}
                          </div>
                        </footer>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
