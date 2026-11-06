import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppShell, Breadcrumb, FlowFooter } from "@/components/app-shell";
import { Checkbox, RadioDot, backButtonClass, primaryButtonClass } from "@/components/flow-controls";
import { CarriedAnswer, ResultLine, SAVED_NOTE, WhatHappens, auditNote, listText, plural } from "@/components/consequence";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { attendanceActions, getState } from "@/lib/attendance-store";
import { hasGeneratedRegisters } from "./attendance-home";

export const BOUNDARY_LEVELS = [
  { label: "State", count: "1 state", unit: "state", hint: "Fewest, largest registers" },
  { label: "LGA", count: "6 LGAs", unit: "LGA", hint: "Fewer, larger registers" },
  { label: "Ward", count: "14 wards", unit: "ward", hint: "Mid-sized registers" },
  { label: "Settlement", count: "96 settlements", unit: "settlement", hint: "Most, smallest registers" },
];

export const FREQUENCIES = [
  { label: "Once a day", chip: "One register with a single attendance session", sessions: 1 },
  { label: "Twice a day", chip: "One register with multiple attendance sessions", sessions: 2 },
];

const countOf = (level) => parseInt(level.count, 10) || 0;

/** How many registers the chosen levels create, and a per-level breakdown. */
function registerTotals(levels) {
  const chosen = BOUNDARY_LEVELS.filter((l) => levels.includes(l.label));
  const total = chosen.reduce((sum, l) => sum + countOf(l), 0);
  const perLevel = chosen.length === 1 ? `one per ${chosen[0].unit}` : listText(chosen.map((l) => `${countOf(l)} for ${l.label}`));
  return { total, perLevel };
}

const AUDIT = auditNote("Downloading the template and creating registers are recorded with your name and the time.");

export default function CustomizeTemplate() {
  const navigate = useNavigate();
  // `?step=N` means we came back from the review page: restore the saved choices.
  const [params] = useSearchParams();
  const resuming = params.get("step") !== null;
  // Otherwise pick up answers left in progress.
  const [draft] = useState(() => (resuming ? null : getState().registerDraft));
  const [step, setStep] = useState(() => (resuming ? (params.get("step") === "1" ? 1 : 0) : draft?.step ?? 0));
  const [levels, setLevels] = useState(() => (resuming ? getState().templateLevels : draft?.levels ?? []));
  const [frequency, setFrequency] = useState(() => (resuming ? getState().templateFrequency : draft?.frequency ?? null));

  useEffect(() => {
    attendanceActions.saveRegisterDraft({ step, levels, frequency });
  }, [step, levels, frequency]);

  const allSelected = levels.length === BOUNDARY_LEVELS.length;
  const toggleLevel = (label) => setLevels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
  const canContinue = step === 0 ? levels.length > 0 : !!frequency;
  const { total, perLevel } = registerTotals(levels);
  const sessions = FREQUENCIES.find((f) => f.label === frequency)?.sessions;

  // Registers already exist for every boundary level, so picking all of them can't create new ones.
  const [existsAlertOpen, setExistsAlertOpen] = useState(false);

  const next = () => {
    // First-time users haven't uploaded any registers yet, so nothing can already exist for them.
    if (step === 0) return allSelected && hasGeneratedRegisters() ? setExistsAlertOpen(true) : setStep(1);
    attendanceActions.setRegisterTemplateOptions({ levels, frequency });
    // The answers now live with the review page (Back returns to them), so drop the in-progress copy.
    attendanceActions.saveRegisterDraft(null);
    navigate("/attendance/register-summary");
  };

  return (
    <AppShell>
      <main className="min-w-0 flex-1 bg-muted/40 px-6 pb-28 pt-4">
        <div className="w-full">
          <Breadcrumb
            items={[
              { label: "Home", to: "/" },
              { label: "Attendance Setup & Management", to: "/attendance" },
              { label: "Customize your Attendance Register Template" },
            ]}
          />
          <h1 className="mt-3 font-condensed text-3xl font-bold text-heading">Customize your Attendance Register Template</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize your attendance register template by selecting the boundary levels and attendance frequency.
          </p>

          <div className="mt-5 rounded-lg border border-border bg-card px-8 py-6">
            {step === 0 && (
              <>
                <h2 className="text-2xl font-bold text-heading">What boundary levels are you generating registers for?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Select one or more boundary levels. We'll create a register for every boundary at the levels you select.
                </p>
                <fieldset className="mt-5">
                  <div className="flex items-center justify-between gap-4">
                    <legend className="text-sm font-bold text-foreground">
                      Boundary level <span className="text-primary">*</span>
                    </legend>
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={allSelected ? "true" : levels.length ? "mixed" : "false"}
                      onClick={() => setLevels(allSelected ? [] : BOUNDARY_LEVELS.map((l) => l.label))}
                      className="flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      <Checkbox checked={allSelected} indeterminate={levels.length > 0 && !allSelected} />
                      Select All
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {BOUNDARY_LEVELS.map((level) => {
                      const on = levels.includes(level.label);
                      return (
                        <button
                          key={level.label}
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => toggleLevel(level.label)}
                          className={`flex w-full items-center gap-3 rounded-md border p-4 text-left transition-colors ${
                            on ? "border-primary bg-selected-bg" : "border-border bg-info-bg hover:border-muted-foreground/30"
                          }`}
                        >
                          <Checkbox checked={on} size="size-4.5" />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-bold text-heading">{level.label}</span>
                            <span className="mt-0.5 block text-xs text-muted-foreground">{level.hint}</span>
                          </span>
                          <span className={`shrink-0 text-right text-sm ${on ? "font-semibold text-heading" : "text-muted-foreground"}`}>{level.count}</span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                {total > 0 ? (
                  <ResultLine>
                    You will create {plural(total, "register")}, {perLevel}.
                  </ResultLine>
                ) : (
                  <ResultLine muted>Select a boundary level to see how many registers you will create.</ResultLine>
                )}
                <WhatHappens
                  notes={[
                    SAVED_NOTE,
                    {
                      kind: "effect",
                      title: "Nothing is created yet",
                      text: "Registers are created only when you upload the filled template. Until then you can change these answers.",
                    },
                    AUDIT,
                  ]}
                />
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-2xl font-bold text-heading">How many times will attendance be recorded each day?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose how many times attendance will be recorded each day.</p>
                <CarriedAnswer changeLabel="Change boundary levels" onChange={() => setStep(0)}>
                  You chose {listText(levels)}: {plural(total, "register")}.
                </CarriedAnswer>
                <div className="mt-4 space-y-3">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f.label}
                      type="button"
                      role="radio"
                      aria-checked={frequency === f.label}
                      onClick={() => setFrequency(f.label)}
                      className={`flex w-full items-start gap-3 rounded-md border p-4 text-left transition-colors ${
                        frequency === f.label ? "border-primary bg-selected-bg" : "border-border bg-info-bg hover:border-muted-foreground/30"
                      }`}
                    >
                      <RadioDot selected={frequency === f.label} />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-heading">{f.label}</span>
                        <span className="mt-1.5 inline-block rounded-xs bg-chip px-2 py-1 text-[11px] font-semibold text-heading">{f.chip}</span>
                        <span className="mt-1.5 block text-xs text-muted-foreground sm:hidden">{plural(f.sessions, "session")} per register</span>
                      </span>
                      <span className={`hidden shrink-0 text-right text-sm sm:block ${frequency === f.label ? "font-semibold text-heading" : "text-muted-foreground"}`}>
                        {plural(f.sessions, "session")} per register
                      </span>
                    </button>
                  ))}
                </div>
                {sessions ? (
                  <ResultLine>
                    You will create {plural(total, "register")}, {plural(sessions, "session")} each. Workers are marked present or absent{" "}
                    {sessions === 1 ? "once" : "twice"} a day.
                  </ResultLine>
                ) : (
                  <ResultLine muted>Choose how often to see what each register will have.</ResultLine>
                )}
                <WhatHappens
                  notes={[
                    SAVED_NOTE,
                    {
                      kind: "effect",
                      title: "You can adjust one register",
                      text: "Every register gets this number of sessions. If one register needs a different number, change its Sessions in the template before you upload.",
                    },
                    AUDIT,
                  ]}
                />
              </>
            )}
          </div>
        </div>
      </main>

      <FlowFooter>
        {step > 0 ? (
          <button onClick={() => setStep((s) => s - 1)} className={backButtonClass}>
            Back
          </button>
        ) : (
          <Link to="/attendance" className={backButtonClass}>
            Back
          </Link>
        )}
        <button disabled={!canContinue} onClick={next} className={primaryButtonClass}>
          {step === 1 ? "Review Template" : "Next"}
        </button>
      </FlowFooter>
      <Dialog open={existsAlertOpen} onOpenChange={setExistsAlertOpen}>
        <DialogContent className="max-w-[40rem] gap-0 bg-white px-10 pb-8 pt-10 text-center sm:rounded-lg">
          <svg viewBox="0 0 24 24" className="mx-auto size-14" aria-hidden="true">
            <path d="M12 2.5 22.5 21h-21L12 2.5Z" fill="#B91900" />
            <path d="M12 9v5.5" stroke="white" strokeWidth="2.2" strokeLinecap="square" />
            <path d="M12 17.2v1.4" stroke="white" strokeWidth="2.2" strokeLinecap="square" />
          </svg>
          <DialogTitle className="mt-4 text-2xl font-bold leading-tight text-heading">Registers already exist for these boundary levels</DialogTitle>
          <DialogDescription className="mt-3 text-base leading-relaxed text-foreground">
            Attendance registers have already been created for the{" "}
            <strong className="font-semibold">
              {BOUNDARY_LEVELS.slice(0, -1)
                .map((l) => l.label)
                .join(", ")}{" "}
              and {BOUNDARY_LEVELS[BOUNDARY_LEVELS.length - 1].label}
            </strong>{" "}
            boundary levels. To view or edit the existing register, go to <strong className="font-semibold">Manage Registers</strong>. You can also
            continue to create a new register; it will be generated with a <strong className="font-semibold">new Register ID</strong>.
          </DialogDescription>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/attendance/registers")}
              className="rounded-md border border-primary bg-white px-4 py-3 text-base font-medium text-primary transition-colors hover:bg-primary/5"
            >
              Go to Manage Registers
            </button>
            <button
              onClick={() => {
                setExistsAlertOpen(false);
                setStep(1);
              }}
              className="rounded-md bg-primary px-4 py-3 text-base font-medium text-primary-foreground transition-colors hover:brightness-95"
            >
              Continue Creating New Register
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
