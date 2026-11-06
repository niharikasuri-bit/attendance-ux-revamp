import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { AppShell, Breadcrumb, FlowFooter } from "@/components/app-shell";
import { backButtonClass } from "@/components/flow-controls";
import { FilterBar, FilterSelect } from "@/components/filters";
import { getRegisters, useAttendanceStore } from "@/lib/attendance-store";
import { Loader, usePageLoading } from "@/components/loader";

const ACTIONS = ["Template Downloaded", "Register Generated", "Register Edited", "Register Deleted", "Users Mapped", "Register Downloaded"];

// No sample history: the log shows only what happens in this copy.
const SEED_LOG = [];

const formatDateTime = (iso) =>
  new Date(iso)
    .toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
    .replace(/ (\d{4}),?/, " $1,");

const COLUMNS = ["Register Name", "Action", "Details", "Role", "Date & Time"];

export default function AuditLog() {
  const [action, setAction] = useState("");
  const loading = usePageLoading();
  const [register, setRegister] = useState("");
  const store = useAttendanceStore();
  const registerIds = useMemo(() => new Map(getRegisters(store).map((r) => [r.name, r.id])), [store]);
  const entries = useMemo(() => [...store.auditLog, ...SEED_LOG], [store.auditLog]);
  const visible = useMemo(
    () => entries.filter((e) => (!register || e.register === register) && (!action || e.action === action)),
    [entries, register, action],
  );

  return (
    <AppShell>
      <main className="min-w-0 flex-1 bg-muted/40 px-6 pb-28 pt-4">
        <div className="w-full">
          <Breadcrumb items={[{ label: "Home", to: "/" }, { label: "Attendance Setup & Management", to: "/attendance" }, { label: "Audit Log" }]} />

          <div className="mt-4 rounded-lg border border-border bg-card px-6 py-5">
            <h1 className="font-condensed text-3xl font-bold text-heading">Audit Log</h1>
            <FilterBar
              onClear={() => {
                setAction("");
                setRegister("");
              }}
            >
              <FilterSelect
                label="Register Name"
                value={register}
                onChange={setRegister}
                options={Array.from(new Set(entries.map((e) => e.register).filter(Boolean))).sort()}
              />
              <FilterSelect label="Action" value={action} onChange={setAction} options={ACTIONS} />
            </FilterBar>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card p-4">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] border-collapse text-left">
                <thead>
                  <tr className="bg-muted">
                    {COLUMNS.map((label, i) => (
                      <th
                        key={label}
                        className={`px-4 py-3 text-xs font-bold text-heading ${i === 0 ? "rounded-l-md" : ""} ${i === COLUMNS.length - 1 ? "rounded-r-md" : ""}`}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={5}>
                        <Loader text="Loading audit log…" />
                      </td>
                    </tr>
                  )}
                  {!loading && visible.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No audit log entries match the selected filters.
                      </td>
                    </tr>
                  )}
                  {!loading && visible.map((e) => (
                    <tr key={e.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3 text-sm font-medium">
                        {registerIds.has(e.register) ? (
                          <Link className="text-primary underline" to={`/attendance/registers/${registerIds.get(e.register)}?from=audit-log`}>
                            {e.register}
                          </Link>
                        ) : (
                          <span className={e.register ? "text-foreground" : "text-muted-foreground"}>{e.register || "—"}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-xs bg-chip px-2 py-1 text-[11px] font-semibold text-heading">{e.action}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-foreground">{e.details}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{e.role}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-muted-foreground">{formatDateTime(e.at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <FlowFooter>
        <Link to="/attendance" className={backButtonClass}>
          <ChevronLeft className="size-4" /> Back
        </Link>
      </FlowFooter>
    </AppShell>
  );
}
