// Consequence visibility: what each answer leads to, shown right where the question is answered.
import { Link } from "react-router-dom";
import { CircleCheck, History, Save } from "lucide-react";

/** The outcome of the current answers. Updates as they change. */
export function ResultLine({ children, muted = false }) {
  return (
    <p
      aria-live="polite"
      className={`mt-4 rounded-md px-4 py-3 text-sm ${muted ? "bg-muted text-muted-foreground" : "bg-info font-semibold text-heading"}`}
    >
      {children}
    </p>
  );
}

/** An earlier answer carried onto this question, with a way back to change it. */
export function CarriedAnswer({ children, changeLabel, onChange }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-md bg-info px-4 py-3 text-sm">
      <p className="font-semibold text-heading">{children}</p>
      <button type="button" onClick={onChange} className="ml-auto font-medium text-primary underline underline-offset-2 hover:no-underline">
        {changeLabel}
      </button>
    </div>
  );
}

const NOTE_ICONS = { saved: Save, effect: CircleCheck, audit: History };

/**
 * Short notes on what happens around this question: what is saved, what an action
 * really does, and what gets recorded. Each note is a { kind, title, text } item.
 */
export function WhatHappens({ notes }) {
  return (
    <ul className="mt-6 grid gap-4 border-t border-border pt-5 md:grid-cols-3">
      {notes.map((n) => {
        const Icon = NOTE_ICONS[n.kind];
        return (
          <li key={n.title} className="flex gap-3">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-info text-info-foreground">
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
            <span className="min-w-0 text-xs leading-relaxed text-muted-foreground">
              <span className="block text-sm font-semibold text-heading">{n.title}</span>
              {n.text}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export const SAVED_NOTE = {
  kind: "saved",
  title: "Your answers are saved",
  text: "They're kept on this device. You can leave this page and pick up where you left off.",
};

/** `sentence` says what is recorded, e.g. "Downloading the template is recorded with your name and the time." */
export function auditNote(sentence) {
  return {
    kind: "audit",
    title: "Recorded in the Audit Log",
    text: (
      <>
        {sentence}{" "}
        <Link to="/attendance/audit-log" className="font-medium text-primary underline underline-offset-2 hover:no-underline">
          View Audit Log
        </Link>
      </>
    ),
  };
}

export const plural = (n, word, many = `${word}s`) => `${n} ${n === 1 ? word : many}`;

/** "A", "A and B", "A, B and C". */
export const listText = (items) => (items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`);
