import { useMemo } from "react";
import { CircleCheck, Info } from "lucide-react";
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
        // A plain info note on what comes next; the footer button takes them there.
        nextStep: (
          <div role="note" className="mt-5 flex items-start gap-3 rounded-md border-l-4 border-info-foreground bg-info px-4 py-3">
            <Info className="mt-0.5 size-5 shrink-0 text-info-foreground" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-heading">What's next</p>
              <p className="mt-0.5 text-sm text-foreground">
                After this, you can map users to your registers. Mapping puts your Frontline Workers, Attendance Markers and Attendance Approvers on the
                register for their boundary, so attendance can be marked for them.
              </p>
            </div>
          </div>
        ),
      }}
      successFooter={{ againLabel: "Create Another Register", nextLabel: "Map Users to Register", nextTo: "/attendance/map-template?preselect=latest" }}
    />
  );
}
