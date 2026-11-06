// Purpose, consequence and outcome preview for a question, in one compact card above the choices.

/**
 * `why`: why this question is asked. `how`: how the choice affects what comes next.
 * `outcome`: what the current answer will create, or null before anything is chosen.
 */
export function ChoiceGuide({ why, how, outcome, pending }) {
  const decided = outcome != null;
  return (
    <div className="mt-4 grid overflow-hidden rounded-lg border border-border md:grid-cols-3">
      <Part label="Why this matters">{why}</Part>
      <Part label="How your choice changes it" className="border-t border-border md:border-l md:border-t-0">
        {how}
      </Part>
      <div
        aria-live="polite"
        className={`border-t-2 px-5 py-4 transition-colors duration-300 md:border-l md:border-l-border ${
          decided ? "border-t-primary bg-selected-bg" : "border-t-border bg-muted/50"
        }`}
      >
        <p className={`text-[11px] font-bold uppercase tracking-wide ${decided ? "text-primary" : "text-muted-foreground"}`}>What you'll get</p>
        <p className={`mt-1.5 text-sm leading-relaxed ${decided ? "font-semibold text-heading" : "text-muted-foreground"}`}>{decided ? outcome : pending}</p>
      </div>
    </div>
  );
}

function Part({ label, className = "", children }) {
  return (
    <div className={`bg-card px-5 py-4 ${className}`}>
      <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-foreground">{children}</p>
    </div>
  );
}
