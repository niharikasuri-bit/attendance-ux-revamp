// A mini copy of the template that fills itself in as people answer each question,
// so they can see what every choice does to the file they'll download.
import { useState } from "react";
import { FileSpreadsheet, PencilLine } from "lucide-react";
import { getRegisters, getState } from "@/lib/attendance-store";

const plural = (n, word) => `${n} ${n === 1 ? word : `${word}s`}`;

/* ---------- Shared pieces ---------- */

/** Window chrome: file name, tabs, the sheet, and a one-line status. */
function TemplateWindow({ fileName, tabs, activeTab, onTab, status, children }) {
  return (
    <section aria-label={`Preview of ${fileName}`} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <header className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <FileSpreadsheet className="size-4 shrink-0 text-success" aria-hidden="true" />
        <span className="truncate text-xs font-semibold text-heading">{fileName}</span>
        <span className="ml-auto shrink-0 text-[11px] font-medium text-muted-foreground">Preview</span>
      </header>
      <div className="max-h-[440px] overflow-auto">{children}</div>
      <div className="flex border-t border-border bg-muted/50 text-[11px] font-semibold" role={onTab ? "tablist" : undefined}>
        {tabs.map((t) =>
          onTab ? (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={t === activeTab}
              onClick={() => onTab(t)}
              className={`border-r border-border px-3 py-2 transition-colors ${
                t === activeTab ? "-mt-px border-t-2 border-t-success bg-card text-heading" : "text-muted-foreground hover:text-heading"
              }`}
            >
              {t}
            </button>
          ) : (
            <span key={t} className="-mt-px border-r border-t-2 border-border border-t-success bg-card px-3 py-2 text-heading">
              {t}
            </span>
          ),
        )}
      </div>
      <footer className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border px-4 py-2.5">
        <p className="text-sm font-semibold text-heading" aria-live="polite">
          {status}
        </p>
        <span className="ml-auto flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] border border-primary/30 bg-primary/10" /> Filled in from your selections
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] border border-dashed border-muted-foreground/50" /> You fill in
          </span>
        </span>
      </footer>
    </section>
  );
}

/** Column header; the column the current question changes is marked. */
function Th({ children, active, className = "" }) {
  return (
    <th
      scope="col"
      className={`sticky top-0 z-10 whitespace-nowrap border-b border-r border-border px-2.5 py-2 text-left text-[11px] font-semibold last:border-r-0 ${
        active ? "bg-primary/10 text-primary shadow-[inset_0_-2px_0_var(--color-primary)]" : "bg-muted text-muted-foreground"
      } ${className}`}
    >
      {children}
    </th>
  );
}

/** A filled cell. Keyed by value, so it flashes whenever its value changes. */
function Filled({ value, active }) {
  return (
    <td className={`border-b border-r border-border px-1 py-1 last:border-r-0 ${active ? "bg-primary/[0.03]" : ""}`}>
      <span key={value} className="cell-flash block truncate rounded-[2px] bg-primary/10 px-1.5 py-1 text-[11px] font-medium text-heading">
        {value}
      </span>
    </td>
  );
}

function ToFill({ active }) {
  return (
    <td className={`border-b border-r border-border px-1 py-1 last:border-r-0 ${active ? "bg-primary/[0.03]" : ""}`}>
      <span className="flex items-center gap-1 rounded-[2px] border border-dashed border-muted-foreground/40 px-1.5 py-[3px] text-[11px] text-muted-foreground/80">
        <PencilLine className="size-3 shrink-0" aria-hidden="true" /> <span className="sr-only">You fill in</span>
      </span>
    </td>
  );
}

/** Not decided yet: a later question fills this. */
function Pending() {
  return (
    <td className="border-b border-r border-border px-1 py-1 last:border-r-0">
      <span className="block rounded-[2px] bg-muted px-1.5 py-1 text-[11px] text-muted-foreground/60">—</span>
    </td>
  );
}

function Empty() {
  return <td className="border-b border-r border-border px-1 py-1 last:border-r-0" />;
}

function MoreRow({ cols, children }) {
  return (
    <tr>
      <td colSpan={cols} className="border-b border-border bg-muted/30 px-3 py-1.5 text-center text-[11px] font-semibold text-primary">
        {children}
      </td>
    </tr>
  );
}

function EmptyState({ cols, children }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-10 text-center text-xs text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}

/** Two columns on wide screens: the question on the left, the template beside it. */
export function WithPreview({ preview, children }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:gap-8">
      <div className="min-w-0">{children}</div>
      <div className="min-w-0 xl:sticky xl:top-4 xl:self-start">{preview}</div>
    </div>
  );
}

/* ---------- Attendance register template ---------- */

const LEVEL_ORDER = ["State", "LGA", "Ward", "Settlement"];

// Sample boundary names so rows read like a real template.
const NAMES = {
  State: ["Plateau"],
  LGA: ["Kanam", "Jos North", "Bokkos", "Mangu", "Pankshin", "Wase"],
  Ward: ["Dengi", "Gagdi", "Jarmai", "Kantana", "Munbutu", "Namaran", "Gyambau"],
  Settlement: ["Angwan Garkuwa", "Makabarta A", "General Hospital Area", "Tudun Wada", "Unguwan Rimi"],
};
const nameAt = (level, i) => {
  const list = NAMES[level];
  return i < list.length ? list[i] : `${list[i % list.length]} ${Math.floor(i / list.length) + 1}`;
};
const ROWS_PER_LEVEL = 3;

function firstRegisterNumber() {
  const numbers = getRegisters(getState()).map((r) => Number(/^BILL (\d{8})$/.exec(r.name)?.[1]) || 0);
  return Math.max(16273672, ...numbers) + 1;
}

/** Attendance_Register_Template.xlsx: one row per register, Sessions from the frequency. */
export function RegisterTemplatePreview({ step, levels, options, frequency }) {
  const [start] = useState(firstRegisterNumber);
  const counts = Object.fromEntries(options.map((o) => [o.label, parseInt(o.count, 10) || 0]));
  const chosen = LEVEL_ORDER.filter((l) => levels.includes(l));
  const total = chosen.reduce((sum, l) => sum + counts[l], 0);
  const sessions = frequency === "Twice a day" ? 2 : frequency ? 1 : null;
  const cols = LEVEL_ORDER.length + 2;

  let offset = 0;
  const groups = chosen.map((level) => {
    const depth = LEVEL_ORDER.indexOf(level);
    const rows = Array.from({ length: Math.min(ROWS_PER_LEVEL, counts[level]) }, (_, i) => ({
      key: `${level}-${i}`,
      path: LEVEL_ORDER.map((l, li) => (li > depth ? null : li === depth ? nameAt(level, i) : nameAt(l, 0))),
      id: `BILL ${start + offset + i}`,
    }));
    offset += counts[level];
    return { level, rows, more: counts[level] - rows.length };
  });

  const status = !total
    ? "Select a boundary level to add registers"
    : `${plural(total, "register")} · Sessions: ${sessions ? `${sessions} per register` : "next question"}`;

  return (
    <TemplateWindow fileName="Attendance_Register_Template.xlsx" tabs={["Attendance Registers"]} status={status}>
      <table className="w-full min-w-[520px] table-fixed border-separate border-spacing-0">
        <caption className="sr-only">Attendance Registers sheet</caption>
        <thead>
          <tr>
            {LEVEL_ORDER.map((l) => (
              <Th key={l} active={step === 0 && levels.includes(l)}>
                {l}
              </Th>
            ))}
            <Th active={step === 0 && total > 0} className="w-[112px]">
              Register ID
            </Th>
            <Th active={step === 1} className="w-[72px]">
              Sessions
            </Th>
          </tr>
        </thead>
        <tbody>
          {total === 0 && <EmptyState cols={cols}>Each register you create appears here as a row.</EmptyState>}
          {groups.map((g) => (
            <GroupRows key={g.level} group={g} cols={cols} sessions={sessions} step={step} />
          ))}
        </tbody>
      </table>
    </TemplateWindow>
  );
}

function GroupRows({ group, cols, sessions, step }) {
  return (
    <>
      {group.rows.map((r) => (
        <tr key={r.key} className="row-in">
          {r.path.map((v, i) => (v ? <Filled key={i} value={v} active={step === 0} /> : <Empty key={i} />))}
          <Filled value={r.id} active={step === 0} />
          {sessions ? <Filled value={String(sessions)} active={step === 1} /> : <Pending />}
        </tr>
      ))}
      {group.more > 0 && (
        <MoreRow cols={cols}>
          + {group.more} more {group.level} {group.more === 1 ? "register" : "registers"}
        </MoreRow>
      )}
    </>
  );
}

/* ---------- User mapping template ---------- */

const USER_TABS = [
  { name: "Frontline Workers", perRegister: 3 },
  { name: "Attendance Markers", perRegister: 1 },
  { name: "Attendance Approvers", perRegister: 1 },
];
const MAX_USER_ROWS = 8;
const boundaryOf = (r) => r.boundaryName || r.boundary?.split(",").pop()?.trim() || "—";
const fmt = (iso) => {
  const d = iso ? new Date(`${iso}T00:00:00Z`) : null;
  return d && !Number.isNaN(d.getTime())
    ? `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${d.getUTCFullYear()}`
    : null;
};

/** Attendee_Template.xlsx: rows per selected register on each tab, Enrollment Date from step 2. */
export function MappingTemplatePreview({ step, registers, selected, sameDate, date }) {
  const [tab, setTab] = useState(USER_TABS[0].name);
  const current = USER_TABS.find((t) => t.name === tab);
  const chosen = registers.filter((r) => selected.includes(r.id));
  const allRows = chosen.flatMap((r) => Array.from({ length: current.perRegister }, (_, i) => ({ key: `${r.id}-${i}`, r })));
  const rows = allRows.slice(0, MAX_USER_ROWS);
  const more = allRows.length - rows.length;
  const dateText = fmt(date);
  const cols = 4;

  const enrollmentStatus =
    step === 0 ? "next question" : sameDate ? (dateText ? `${dateText} for everyone` : "pick a date") : "you fill in for each user";
  const status = chosen.length ? `${plural(chosen.length, "register")} on all 3 tabs · Enrollment Date: ${enrollmentStatus}` : "Select registers to pre-fill them";

  return (
    <TemplateWindow fileName="Attendee_Template.xlsx" tabs={USER_TABS.map((t) => t.name)} activeTab={tab} onTab={setTab} status={status}>
      <table className="w-full min-w-[520px] table-fixed border-separate border-spacing-0">
        <caption className="sr-only">{tab} sheet</caption>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th active={step === 0 && chosen.length > 0}>Boundary</Th>
            <Th active={step === 0 && chosen.length > 0} className="w-[120px]">
              Register ID
            </Th>
            <Th active={step === 1} className="w-[118px]">
              Enrollment Date
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && <EmptyState cols={cols}>Each register you select adds rows here, ready for you to add users.</EmptyState>}
          {rows.map(({ key, r }) => (
            <tr key={key} className="row-in">
              <ToFill />
              <Filled value={boundaryOf(r)} active={step === 0} />
              <Filled value={r.name} active={step === 0} />
              {step === 0 ? <Pending /> : sameDate && dateText ? <Filled value={dateText} active /> : <ToFill active />}
            </tr>
          ))}
          {more > 0 && <MoreRow cols={cols}>+ {plural(more, "more row")}</MoreRow>}
        </tbody>
      </table>
    </TemplateWindow>
  );
}
