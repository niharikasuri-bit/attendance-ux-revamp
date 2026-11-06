import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CircleCheck, UserPlus } from "lucide-react";
import { TemplateUploadPage } from "@/components/template-upload-page";
import { useAttendanceStore } from "@/lib/attendance-store";
import { buildRegisterTemplate, checkRegisterTemplate, downloadRegisterTemplate, uploadRegisterTemplate } from "@/lib/templates";
import { REGISTER_GENERATED_KEY } from "./attendance-home";

const plural = (n, word) => `${n} ${n === 1 ? word : `${word}s`}`;

/** "3 registers uploaded" */
function describeRegisterCheck({ created, updated }) {
  return `${plural(created + updated, "register")} uploaded`;
}

export default function UploadRegisters() {
  const { templateLevels, templateFrequency } = useAttendanceStore();
  const frequency = templateFrequency ?? "Once a day";
  const registerCount = useMemo(() => buildRegisterTemplate().sheets.find((s) => !s.guide && !s.reference)?.rows.length ?? 0, [templateFrequency]);
  const summary = [plural(registerCount, "register"), ...(templateLevels.length ? [templateLevels.join(", ")] : []), frequency];

  return (
    <TemplateUploadPage
      title="Upload Populated Register Template"
      previewTitle="Generated Attendance Register Template"
      confirmFromPreview
      previewSummary={summary}
      buildTemplate={buildRegisterTemplate}
      downloadTemplate={downloadRegisterTemplate}
      upload={uploadRegisterTemplate}
      check={checkRegisterTemplate}
      describeCheck={describeRegisterCheck}
      resultHint="how many registers are uploaded"
      onUploaded={() => {
        try {
          localStorage.setItem(REGISTER_GENERATED_KEY, "true");
        } catch {
          // ignore
        }
      }}
      backTo="/attendance/register-summary"
      showGeneratedModal
      generatedModal={{
        title: "Attendance Register Template Generated",
        message: "Your attendance register is ready. Review it, then upload it, or download it if you need to make changes.",
      }}
      success={{
        cardClass: "mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-xl",
        header: (result) => (
          <div className="bg-success px-8 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-foreground/20">
              <CircleCheck className="size-7 text-success-foreground" strokeWidth={1.5} />
            </div>
            <h2 className="mt-4 font-condensed text-3xl font-bold text-success-foreground">
              {result ? `${plural(result.created + result.updated, "Attendance Register")} Added Successfully!` : "Attendance Registers Added Successfully!"}
            </h2>
          </div>
        ),
        message: (
          <>
            The populated register template you uploaded has been added successfully. Download a copy now, and manage it anytime from <strong className="font-semibold">Manage Registers</strong>.
          </>
        ),
        // What to do now: the new registers are empty until users are added to them.
        nextStep: (result) => {
          const count = result ? result.created + result.updated : null;
          return (
            <div className="mt-5 rounded-lg border border-info-foreground/25 bg-info p-5">
              <p className="text-base font-bold text-heading">Next, add users to {count ? `your ${plural(count, "register")}` : "your registers"}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                Your registers are ready, but they have no users yet. Add the users who will be marked in each register so supervisors can start
                taking attendance.
              </p>
              <Link
                to="/attendance/map-template?preselect=latest"
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:brightness-95"
              >
                <UserPlus className="size-4" aria-hidden="true" /> Add Users to Registers
              </Link>
            </div>
          );
        },
      }}
      successFooter={{ againLabel: "Create Another Register", nextLabel: "Add Users to Registers", nextTo: "/attendance/map-template?preselect=latest" }}
    />
  );
}
