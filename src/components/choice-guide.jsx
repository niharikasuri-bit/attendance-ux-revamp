// Info box above a question's choices: grey while it explains what the choice decides,
// blue once a choice is made and it shows what that choice creates.

/** `decided`: a choice has been made. `title`/`children`: the message for the current state. */
export function ChoiceInfo({ decided, title, children }) {
  return (
    <div
      aria-live="polite"
      className={`relative mt-4 overflow-hidden rounded-lg border py-3.5 pl-6 pr-5 transition-colors duration-300 ${
        decided ? "border-info-foreground/25 bg-info" : "border-border bg-muted/70"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 transition-colors duration-300 ${decided ? "bg-info-foreground" : "bg-muted-foreground/40"}`}
      />
      <p className={`text-sm font-semibold ${decided ? "text-info-foreground" : "text-heading"}`}>{title}</p>
      <p className={`mt-0.5 text-sm leading-relaxed ${decided ? "font-medium text-heading" : "text-muted-foreground"}`}>{children}</p>
    </div>
  );
}
