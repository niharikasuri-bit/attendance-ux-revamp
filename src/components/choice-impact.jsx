// Live previews shown right under each question, so people can see what their choice
// does to the register or template while they are still answering.
import { useEffect, useRef, useState } from "react";
import { PencilLine, Sparkles } from "lucide-react";

const plural = (n, word) => `${n} ${n === 1 ? word : `${word}s`}`;

/** Counts smoothly from the previous value to `value`. */
function useCountUp(value, duration = 450) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const start = from.current;
    if (reduce || start === value) {
      from.current = value;
      setShown(value);
      return;
    }
    let frame;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setShown(Math.round(start + (value - start) * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
      else from.current = value;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      from.current = value;
    };
  }, [value, duration]);
  return shown;
}

/** Shared frame: an eyebrow, a live sentence and the visual. */
function ImpactFrame({ summary, children }) {
  return (
    <section aria-label="Live preview" className="impact-frame mt-6 rounded-lg border border-dashed border-primary/35 bg-selected-bg/60 p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
          <Sparkles className="size-3.5" aria-hidden="true" /> Live preview
        </span>
        <p className="text-sm font-semibold text-heading" aria-live="polite">
          {summary}
        </p>
      </div>
      <div className="mt-4" aria-hidden="true">
        {children}
      </div>
    </section>
  );
}

/* ---------- Register template: boundary levels ---------- */

/** One row per boundary level; each square is a register that will be created. */
export function BoundaryImpact({ levels, options }) {
  const rows = options.map((o) => ({ ...o, n: parseInt(o.count, 10) || 0, on: levels.includes(o.label) }));
  const total = rows.filter((r) => r.on).reduce((sum, r) => sum + r.n, 0);
  const shown = useCountUp(total);
  const summary = total
    ? `${plural(total, "register")} will be created, one for every boundary at ${levels.length === 1 ? "this level" : "these levels"}.`
    : "Select a boundary level to see how many registers will be created.";

  return (
    <ImpactFrame summary={summary}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_180px] lg:items-center">
        <ul className="space-y-2.5">
          {rows.map((r) => (
            <li key={r.label} className="grid grid-cols-[96px_minmax(0,1fr)_40px] items-center gap-3">
              <span className={`text-xs font-semibold transition-colors ${r.on ? "text-heading" : "text-muted-foreground/70"}`}>{r.label}</span>
              <span className="flex flex-wrap gap-[3px]">
                {Array.from({ length: r.n }, (_, i) => (
                  <span
                    key={`${r.label}-${i}-${r.on}`}
                    className={`size-2.5 rounded-[2px] ${r.on ? "impact-pop bg-primary" : "bg-muted-foreground/15"}`}
                    style={r.on ? { animationDelay: `${Math.min(i * 6, 360)}ms` } : undefined}
                  />
                ))}
              </span>
              <span className={`text-right text-xs tabular-nums transition-colors ${r.on ? "font-bold text-primary" : "text-muted-foreground/60"}`}>
                {r.on ? `+${r.n}` : r.n}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex flex-row items-baseline gap-2 rounded-md border border-border bg-card px-4 py-3 lg:flex-col lg:items-center lg:gap-0 lg:py-5">
          <span className={`font-condensed text-4xl font-bold tabular-nums ${total ? "text-primary" : "text-muted-foreground/50"}`}>{shown}</span>
          <span className="text-xs font-semibold text-muted-foreground">{total === 1 ? "register" : "registers"}</span>
        </div>
      </div>
    </ImpactFrame>
  );
}

/* ---------- Register template: attendance frequency ---------- */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WORKERS = ["Worker 1", "Worker 2", "Worker 3"];
// A fixed, believable pattern of marks so the grid reads as a real register.
const ABSENT = new Set(["1-2-1", "2-4-0", "0-5-1"]);

/** A week of a register: each day splits into one cell per session. */
export function FrequencyImpact({ frequency }) {
  const sessions = frequency === "Twice a day" ? 2 : frequency ? 1 : 0;
  const summary = sessions
    ? `Each day has ${plural(sessions, "attendance session")}, so a worker can be marked ${sessions === 1 ? "once" : "twice"} a day. Sessions = ${sessions} in the template.`
    : "Choose a frequency to see how a week of attendance will look.";

  return (
    <ImpactFrame summary={summary}>
      <div className={`overflow-x-auto rounded-md border border-border bg-card transition-opacity ${sessions ? "" : "opacity-50"}`}>
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[96px_repeat(7,minmax(0,1fr))] border-b border-border bg-muted/50 text-[11px] font-semibold text-muted-foreground">
            <span className="px-3 py-2">Register</span>
            {DAYS.map((d) => (
              <span key={d} className="border-l border-border px-2 py-2 text-center">
                {d}
                <span className="mt-1 flex gap-[3px]">
                  {Array.from({ length: Math.max(sessions, 1) }, (_, s) => (
                    <span key={s} className="flex-1 text-[9px] font-medium text-muted-foreground/80">
                      {sessions === 2 ? `S${s + 1}` : sessions === 1 ? "S1" : "–"}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </div>
          {WORKERS.map((w, wi) => (
            <div key={w} className="grid grid-cols-[96px_repeat(7,minmax(0,1fr))] border-b border-border text-xs last:border-0">
              <span className="px-3 py-2 font-medium text-heading">{w}</span>
              {DAYS.map((d, di) => (
                <span key={d} className="flex gap-[3px] border-l border-border p-1.5">
                  {Array.from({ length: Math.max(sessions, 1) }, (_, s) => {
                    const absent = ABSENT.has(`${wi}-${di}-${s}`);
                    return (
                      <span
                        key={`${s}-${sessions}`}
                        className={`impact-pop flex h-6 flex-1 items-center justify-center rounded-[3px] text-[10px] font-bold ${
                          !sessions ? "bg-muted" : absent ? "bg-destructive/10 text-destructive" : "bg-success/15 text-success"
                        }`}
                        style={{ animationDelay: `${(wi * 7 + di) * 12}ms` }}
                      >
                        {sessions ? (absent ? "A" : "P") : ""}
                      </span>
                    );
                  })}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      {sessions > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          <strong className="font-semibold text-heading tabular-nums">{WORKERS.length * DAYS.length * sessions}</strong> attendance marks for {WORKERS.length} workers
          in a week
        </p>
      )}
    </ImpactFrame>
  );
}

/* ---------- User mapping template: registers ---------- */

const USER_TABS = ["Frontline Workers", "Attendance Markers", "Attendance Approvers"];
const MAX_ROWS = 4;

const boundaryOf = (r) => r.boundaryName || r.boundary?.split(",").pop()?.trim() || "—";

function Legend() {
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-[2px] border border-primary/30 bg-primary/10" /> Filled in from your selections
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-[2px] border border-dashed border-muted-foreground/50 bg-card" /> You fill in
      </span>
    </div>
  );
}

/** The Frontline Workers tab with a pre-filled row appearing for each selected register. */
export function RegisterMappingImpact({ registers, selected }) {
  const chosen = registers.filter((r) => selected.includes(r.id));
  const rows = chosen.slice(0, MAX_ROWS);
  const more = chosen.length - rows.length;
  const summary = chosen.length
    ? `Your template will be pre-filled with ${plural(chosen.length, "register")} on all ${USER_TABS.length} tabs.`
    : "Select registers to see them pre-filled in your template.";

  return (
    <ImpactFrame summary={summary}>
      <div className="overflow-hidden rounded-md border border-border bg-card">
        <div className="flex border-b border-border bg-muted/50 text-[11px] font-semibold">
          {USER_TABS.map((t, i) => (
            <span key={t} className={`border-r border-border px-3 py-2 ${i === 0 ? "bg-card text-heading" : "text-muted-foreground"}`}>
              {t}
            </span>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead className="text-[11px] text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-3 py-2 font-semibold">Name</th>
                <th className="px-3 py-2 font-semibold">Boundary</th>
                <th className="px-3 py-2 font-semibold">Register ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                    No registers selected yet
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="impact-slide border-b border-border last:border-0">
                  <td className="p-1.5">
                    <span className="flex h-7 items-center gap-1.5 rounded-[3px] border border-dashed border-muted-foreground/40 px-2 text-muted-foreground/70">
                      <PencilLine className="size-3" />
                    </span>
                  </td>
                  <td className="p-1.5">
                    <span className="flex h-7 items-center truncate rounded-[3px] border border-primary/25 bg-primary/10 px-2 font-medium text-heading">{boundaryOf(r)}</span>
                  </td>
                  <td className="p-1.5">
                    <span className="flex h-7 items-center rounded-[3px] border border-primary/25 bg-primary/10 px-2 font-semibold text-heading">{r.name}</span>
                  </td>
                </tr>
              ))}
              {more > 0 && (
                <tr>
                  <td colSpan={3} className="px-3 py-2 text-center text-[11px] font-semibold text-primary">
                    + {plural(more, "more register")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Legend />
    </ImpactFrame>
  );
}

/* ---------- User mapping template: enrollment date ---------- */

const PEOPLE = [
  { tab: "Frontline Workers", start: 1 },
  { tab: "Attendance Markers", start: 4 },
  { tab: "Attendance Approvers", start: 7 },
];
const SPAN = 12; // days on the timeline
const SAME_OFFSET = 3; // where the chosen date sits on the timeline

const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

/** A timeline per user type: users appear on the register from their enrollment date. */
export function EnrollmentImpact({ sameDate, date }) {
  const parsed = date ? new Date(`${date}T00:00:00Z`) : null;
  const valid = parsed && !Number.isNaN(parsed.getTime());
  const day0 = valid ? new Date(parsed.getTime() - SAME_OFFSET * 86400000) : null;
  const dayLabel = (i) => (day0 ? new Date(day0.getTime() + i * 86400000).getUTCDate() : i + 1);

  const summary = sameDate
    ? valid
      ? `Every user appears on the register from ${fmt(parsed)}. Enrollment Date is pre-filled for everyone.`
      : "Pick a date to see when users appear on the register."
    : `You'll enter an Enrollment Date for each user on all ${USER_TABS.length} tabs, so users can start on different days.`;

  return (
    <ImpactFrame summary={summary}>
      <div className="overflow-x-auto rounded-md border border-border bg-card p-4">
        <div className="relative min-w-[520px]">
          <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-3 pb-2 text-[10px] font-semibold text-muted-foreground">
            <span />
            <span className="grid" style={{ gridTemplateColumns: `repeat(${SPAN}, minmax(0,1fr))` }}>
              {Array.from({ length: SPAN }, (_, i) => (
                <span key={i} className={`text-center tabular-nums ${sameDate && i === SAME_OFFSET ? "text-primary" : ""}`}>
                  {dayLabel(i)}
                </span>
              ))}
            </span>
          </div>
          {PEOPLE.map((p) => {
            const start = sameDate ? SAME_OFFSET : p.start;
            return (
              <div key={p.tab} className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-3 py-1.5">
                <span className="truncate text-xs font-medium text-heading">{p.tab}</span>
                <span className="relative h-7 rounded-[3px] bg-muted">
                  <span
                    className="impact-bar absolute inset-y-0 right-0 flex items-center rounded-[3px] bg-success/20 pl-2 text-[10px] font-bold text-success"
                    style={{ left: `${(start / SPAN) * 100}%` }}
                  >
                    <span className="mr-1.5 h-4 w-[3px] rounded-full bg-success" />
                    P / A
                  </span>
                </span>
              </div>
            );
          })}
          {sameDate && valid && (
            <span
              className="impact-bar pointer-events-none absolute bottom-0 top-5 w-0 border-l-2 border-dashed border-primary"
              style={{ left: `calc(150px + 0.75rem + (100% - 150px - 0.75rem) * ${SAME_OFFSET / SPAN})` }}
            />
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[2px] bg-muted" /> Not on the register yet
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-[2px] bg-success/20" /> Can be marked Present or Absent
        </span>
        <span className="ml-auto flex items-center gap-1.5 font-semibold text-heading">
          Enrollment Date:
          {sameDate ? (
            <span className="rounded-[3px] border border-primary/25 bg-primary/10 px-2 py-0.5">{valid ? fmt(parsed) : "—"}</span>
          ) : (
            <span className="flex items-center gap-1 rounded-[3px] border border-dashed border-muted-foreground/50 px-2 py-0.5 font-medium text-muted-foreground">
              <PencilLine className="size-3" /> You fill in, per user
            </span>
          )}
        </span>
      </div>
    </ImpactFrame>
  );
}
