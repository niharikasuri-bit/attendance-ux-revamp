// Summary box on the right of a question: grey with a short note until something is chosen,
// then blue with what the choices add up to.

/**
 * `title`: box heading. `decided`: something has been chosen. `note`: shown before that.
 * `stat`: { value, label } big number. `rows`: [label, value] pairs under it.
 * `showStat`: show the numbers even before this question is answered (carried from an earlier one).
 */
export function SummaryBox({ title, decided, note, stat, rows = [], showStat = false }) {
  return (
    <aside
      aria-live="polite"
      aria-label={title}
      className={`overflow-hidden rounded-xl border transition-colors duration-300 ${
        decided ? "border-info-foreground/25 bg-info" : "border-border bg-muted/60"
      }`}
    >
      <p
        className={`border-b px-5 py-3 text-xs font-bold uppercase tracking-wide transition-colors duration-300 ${
          decided ? "border-info-foreground/15 text-info-foreground" : "border-border text-muted-foreground"
        }`}
      >
        {title}
      </p>
      <div className="px-5 py-4">
        {(decided || showStat) && stat ? (
          <>
            <p className="flex items-baseline gap-2">
              <span className="font-condensed text-4xl font-bold tabular-nums text-heading">{stat.value}</span>
              <span className="text-sm font-semibold text-heading">{stat.label}</span>
            </p>
            {rows.length > 0 && (
              <dl className="mt-3 divide-y divide-info-foreground/10 border-t border-info-foreground/15">
                {rows.map(([k, v], i) => (
                  <div key={`${k}-${i}`} className="flex items-start justify-between gap-4 py-2 text-sm">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-semibold text-heading">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>
        )}
      </div>
    </aside>
  );
}

/** Question on the left, summary box on the right (stacked on small screens). */
export function WithSummary({ summary, children }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
      <div className="min-w-0">{children}</div>
      <div className="lg:sticky lg:top-4 lg:self-start">{summary}</div>
    </div>
  );
}
