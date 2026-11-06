import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { X } from "lucide-react";
import { AppShell, Breadcrumb } from "@/components/app-shell";
import illustration from "@/assets/attendance-illustration.png";

// Set by the upload step once registers have been added.
export const REGISTER_GENERATED_KEY = "attendanceUxRevampRegisterGenerated";

/** True once the user has uploaded registers at least once. */
export function hasGeneratedRegisters() {
  try {
    return localStorage.getItem(REGISTER_GENERATED_KEY) === "true";
  } catch {
    return false;
  }
}

export default function AttendanceHome() {
  const [introOpen, setIntroOpen] = useState(true);

  // Returning users work from the register list; only first-time users see this empty state.
  if (hasGeneratedRegisters()) return <Navigate to="/attendance/registers" replace />;

  const crumbs = [{ label: "Home", to: "/" }, { label: "Attendance Setup & Management" }];

  return (
    <AppShell>
      <main className="min-w-0 flex-1 px-6 pb-12 pt-4">
          <>
            <div className="max-w-5xl">
              <Breadcrumb items={crumbs} />
            </div>
            <div className="mt-8 flex w-full justify-center">
              <div className="flex w-full max-w-none flex-col items-center rounded-md border border-border bg-card p-6 text-center">
                <img src={illustration} alt="Illustration of an attendance register clipboard" className="h-44 w-auto object-contain" width={1024} height={1024} />
                <h2 className="mt-4 text-2xl font-bold text-heading">Start by creating your attendance register</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">Create an attendance register to record and manage attendance for campaign users.</p>
                <Link
                  to="/attendance/customize"
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:brightness-95"
                >
                  Generate New Register
                </Link>
              </div>
            </div>
          </>
      </main>

      {introOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" role="dialog" aria-modal="true" aria-label="What is an attendance register?">
          <div className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-[46rem] flex-col overflow-hidden rounded-md bg-card shadow-xl">
            <button
              aria-label="Close"
              onClick={() => setIntroOpen(false)}
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="size-5" />
            </button>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-8 [@media(max-height:640px)]:pt-6">
              <img
                src={illustration}
                alt="Illustration of an attendance register clipboard"
                className="mx-auto h-20 w-20 object-contain"
                width={1024}
                height={1024}
              />
              <h2 className="mt-4 text-center text-xl font-bold text-heading">What is an attendance register?</h2>
              <p className="mt-3 rounded-lg bg-info-bg px-4 py-3 text-center text-sm leading-relaxed text-foreground">
                An attendance register is a list a supervisor uses to mark workers present or absent.
              </p>

              <hr className="mt-5 border-border" />
              <h3 className="mt-4 text-sm font-bold text-heading">What’s inside a register?</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {[
                  { label: "Where attendance is marked", text: "The boundary levels the register is divided by. Each level is a column, filled with the boundaries selected for the campaign." },
                  { label: "How often attendance is marked", text: "The number of times a day attendance is recorded: once or twice." },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-info-bg p-3">
                    <span className="rounded-md bg-chip px-1.5 py-0.5 text-[11px] font-semibold text-heading">{item.label}</span>
                    <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>

              <hr className="mt-5 border-border" />
              <h3 className="mt-4 text-sm font-bold text-heading">Who is in a register?</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {[
                  { label: "Frontline Workers", text: "The people whose attendance is marked." },
                  { label: "Attendance Markers", text: "The people who mark it." },
                  { label: "Attendance Approvers", text: "The people who check and approve it." },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-info-bg p-3">
                    <span className="rounded-md bg-chip px-1.5 py-0.5 text-[11px] font-semibold text-heading">{item.label}</span>
                    <p className="mt-1.5 text-xs leading-snug text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>

              <hr className="mt-5 border-border" />
              <h3 className="mt-4 text-sm font-bold text-heading">What does a register record?</h3>
              <p className="mt-2 rounded-lg bg-info-bg px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                Each frontline worker’s attendance, either{" "}
                <span className="rounded-md bg-green-100 px-1.5 py-0.5 text-[11px] font-medium text-green-800">Present</span> or{" "}
                <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-[11px] font-medium text-red-800">Absent</span>, for every time attendance is marked in a day.
              </p>

              <hr className="mt-5 border-border" />
              <h3 className="mt-4 text-sm font-bold text-heading">Where does a register go after approval?</h3>
              <ol className="mt-2 space-y-0 rounded-lg bg-info-bg px-4 py-3">
                {[
                  "The Attendance Approver approves it.",
                  "The Campaign Supervisor approves it and generates the bill.",
                  "It passes through further checks and approvals.",
                  "The Payment Approver converts it into a payment advisory.",
                  "The frontline workers are paid for the attendance recorded.",
                ].map((text, i, all) => (
                  <li key={text} className="relative flex gap-3 pb-3 last:pb-0">
                    {i < all.length - 1 && <span aria-hidden="true" className="absolute left-[9px] top-5 h-full w-px bg-border" />}
                    <span
                      className={`relative grid size-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                        i === all.length - 1 ? "bg-green-700 text-white" : "bg-heading text-white"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className={`pt-0.5 text-xs leading-snug ${i === all.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground"}`}>{text}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="shrink-0 px-6 pb-6 pt-4">
              <Link
                to="/attendance/customize"
                className="block w-full rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:brightness-95"
              >
                Generate New Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
