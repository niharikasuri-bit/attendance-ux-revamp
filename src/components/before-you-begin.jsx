// "Before you Begin" popup shown when a flow starts: what the steps ahead are, one line each.
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const P = "var(--color-primary)";
const H = "var(--color-heading)";
const G = "#e6e8eb";
const G2 = "#cfd4da";

/* ---------- Small spot illustrations (120 x 80) ---------- */

function MapArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      <rect x="4" y="6" width="112" height="68" rx="4" fill={G} />
      <path d="M4 30 L50 22 L80 40 L116 32 M40 6 L52 74 M80 40 L92 74" stroke="#fff" strokeWidth="3" fill="none" />
      <path d="M30 48 L56 44 L62 64 L34 68 Z" fill={P} opacity=".18" stroke={P} strokeWidth="1.5" />
      <path d="M48 20c0-6.6 5.4-12 12-12s12 5.4 12 12c0 9-12 22-12 22S48 29 48 20Z" fill={P} />
      <circle cx="60" cy="20" r="4.5" fill="#fff" />
      <path d="M92 50 l6-5 6 5 v8 h-12z" fill={P} opacity=".85" />
    </svg>
  );
}

function ClockArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      <circle cx="44" cy="40" r="30" fill={G} />
      <circle cx="44" cy="40" r="23" fill="#fff" stroke={H} strokeWidth="2.5" />
      <path d="M44 25 V40 L54 46" stroke={P} strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="80" y="22" width="30" height="14" rx="3" fill={P} />
      <rect x="80" y="44" width="30" height="14" rx="3" fill={P} opacity=".35" />
      <path d="M86 29 l3 3 6-6" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function SheetArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      <rect x="18" y="8" width="70" height="64" rx="4" fill="#fff" stroke={G2} strokeWidth="2" />
      <rect x="18" y="8" width="70" height="12" rx="4" fill={H} />
      {[28, 40, 52].map((y) => (
        <g key={y}>
          <rect x="24" y={y} width="18" height="7" rx="1.5" fill={G} />
          <rect x="46" y={y} width="18" height="7" rx="1.5" fill={G} />
          <rect x="68" y={y} width="14" height="7" rx="1.5" fill={P} opacity=".3" />
        </g>
      ))}
      <circle cx="94" cy="58" r="15" fill={P} />
      <path d="M94 50 V64 M88 59 l6 6 6-6" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      <path d="M30 60a16 16 0 0 1 2-31.8A22 22 0 0 1 74 22a18 18 0 0 1 16 38Z" fill={G} />
      <rect x="44" y="34" width="32" height="38" rx="3" fill="#fff" stroke={H} strokeWidth="2" />
      <path d="M50 44 h20 M50 51 h20 M50 58 h12" stroke={G2} strokeWidth="3" strokeLinecap="round" />
      <circle cx="88" cy="22" r="13" fill={P} />
      <path d="M88 29 V16 M82 21 l6-6 6 6" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RegistersArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${14 + i * 6} ${10 + i * 8})`}>
          <rect width="64" height="44" rx="4" fill="#fff" stroke={i === 2 ? H : G2} strokeWidth="2" />
          <rect x="8" y="8" width="26" height="5" rx="2" fill={i === 2 ? H : G} />
          <rect x="8" y="18" width="46" height="4" rx="2" fill={G} />
          <rect x="8" y="26" width="38" height="4" rx="2" fill={G} />
        </g>
      ))}
      <circle cx="96" cy="52" r="13" fill={P} />
      <path d="M90 52 l4 4 8-8" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FolderArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      <path d="M20 18 h28 l6 7 h46 a4 4 0 0 1 4 4 v39 a4 4 0 0 1-4 4 H20 a4 4 0 0 1-4-4 V22 a4 4 0 0 1 4-4Z" fill={H} />
      <rect x="22" y="30" width="78" height="40" rx="3" fill="#fff" stroke={G2} strokeWidth="2" />
      <rect x="30" y="38" width="30" height="5" rx="2" fill={G} />
      <rect x="30" y="48" width="44" height="4" rx="2" fill={G} />
      <rect x="30" y="56" width="36" height="4" rx="2" fill={G} />
      <circle cx="96" cy="60" r="12" fill={P} />
      <path d="M90 60 l4 4 8-8" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CalendarArt() {
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      <rect x="22" y="12" width="76" height="60" rx="5" fill="#fff" stroke={G2} strokeWidth="2" />
      <rect x="22" y="12" width="76" height="14" rx="5" fill={H} />
      <path d="M38 8 v10 M82 8 v10" stroke={H} strokeWidth="3" strokeLinecap="round" />
      {[0, 1, 2, 3, 4].map((c) =>
        [0, 1, 2].map((r) => (
          <rect key={`${c}-${r}`} x={30 + c * 13} y={33 + r * 12} width="9" height="8" rx="1.5" fill={c === 2 && r === 1 ? P : G} />
        )),
      )}
      <path d="M60 45 h40" stroke={P} strokeWidth="3" strokeLinecap="round" opacity=".5" />
    </svg>
  );
}

function PeopleArt() {
  const person = (x, y, fill) => (
    <g transform={`translate(${x} ${y})`}>
      <circle r="13" fill={G} />
      <circle cy="-3" r="5" fill={fill} />
      <path d="M-8 9a8 7 0 0 1 16 0Z" fill={fill} />
    </g>
  );
  return (
    <svg viewBox="0 0 120 80" className="h-full w-full">
      {person(22, 22, H)}
      {person(52, 22, P)}
      {person(82, 22, H)}
      {person(37, 54, H)}
      {person(67, 54, H)}
      <circle cx="100" cy="56" r="11" fill={P} />
      <path d="M100 51 v10 M95 56 h10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Content for each flow: what needs to be in place first ---------- */

export const REGISTER_STEPS = {
  intro: "Before you create attendance registers, please make sure you have the following information handy.",
  steps: [
    { Art: MapArt, title: "Boundary Levels", text: "The boundary levels where attendance will be taken. A register is created for every boundary at these levels." },
    { Art: ClockArt, title: "Attendance Frequency", text: "How many times a day attendance will be taken." },
    { Art: UploadArt, title: "Excel Upload", text: "You'll download an Excel template, fill it in, and upload it to create the registers." },
  ],
};

export const MAPPING_STEPS = {
  intro: "Before you map users to registers, please make sure you have the following information handy.",
  steps: [
    { Art: RegistersArt, title: "Attendance Registers", text: "Registers need to be created first. Users are mapped to these registers." },
    { Art: PeopleArt, title: "Users", text: "A list of users with their user IDs, names, usernames, and roles." },
    { Art: CalendarArt, title: "Enrollment Dates", text: "The date from which each user can be marked Present or Absent." },
    { Art: UploadArt, title: "Excel Upload", text: "You'll download an Excel template, add your users, and upload it to map them to registers." },
  ],
};

/** The popup itself. `content` is REGISTER_STEPS or MAPPING_STEPS. All text is Roboto (font-sans). */
export function BeforeYouBegin({ open, onClose, content }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="font-sans flex max-h-[90vh] max-w-[46rem] flex-col gap-0 bg-white p-0 sm:rounded-xl [&>button:last-child]:right-6 [&>button:last-child]:top-6 [&>button:last-child>svg]:size-6">
        <div className="border-b border-border px-6 pb-5 pt-7 sm:px-8">
          <DialogTitle className="font-sans text-[2rem] font-bold leading-tight text-heading">Before you Begin</DialogTitle>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
          <DialogDescription className="text-base leading-relaxed text-foreground/80">{content.intro}</DialogDescription>
          <ul className="mt-2">
            {content.steps.map(({ Art, title, text }) => (
              <li key={title} className="flex items-center gap-4 border-b border-border py-5 last:border-0 sm:gap-6">
                <span className="h-14 w-[84px] shrink-0 sm:h-20 sm:w-[120px]" aria-hidden="true">
                  <Art />
                </span>
                <span className="min-w-0">
                  <span className="block font-sans text-xl font-bold leading-tight text-heading sm:text-2xl">
                                        {title}
                  </span>
                  <span className="mt-1 block text-base leading-snug text-foreground/80">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-border px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-md bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground outline-none transition-colors hover:brightness-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Continue
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
