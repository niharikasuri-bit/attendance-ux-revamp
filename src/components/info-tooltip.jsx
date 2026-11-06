// Small "i" button that shows a short explanation on hover or keyboard focus (WCAG 1.4.13: hoverable, dismissable with Escape).
import { useId, useState } from "react";
import { Info } from "lucide-react";

export function InfoTooltip({ label, children }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex align-middle" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={id}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="grid size-5 place-items-center rounded-full text-muted-foreground transition-colors hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Info className="size-4" aria-hidden="true" />
      </button>
      <span
        id={id}
        role="tooltip"
        className={`absolute left-1/2 top-full z-30 mt-2 w-72 -translate-x-1/2 rounded-md bg-heading px-3 py-2.5 text-left text-xs font-normal leading-relaxed text-white shadow-lg ${
          open ? "visible opacity-100" : "invisible opacity-0"
        } transition-opacity`}
      >
        <span aria-hidden="true" className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-heading" />
        {children}
      </span>
    </span>
  );
}
