// A tutorial opened in place: title, video area, "Was this video helpful?" and a close button.
import { useState } from "react";
import { CirclePlay, ThumbsDown, ThumbsUp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export function TutorialDialog({ tutorial, onClose }) {
  const [rating, setRating] = useState(null);
  return (
    <Dialog open={!!tutorial} onOpenChange={(o) => !o && (onClose(), setRating(null))}>
      {tutorial && (
        <DialogContent className="max-w-2xl gap-0 bg-white p-0 sm:rounded-xl [&>button:last-child]:right-5 [&>button:last-child]:top-5 [&>button:last-child>svg]:size-5">
          <div className="border-b border-border px-6 pb-4 pt-5 pr-14">
            <div className="flex flex-wrap items-center gap-2.5">
              <DialogTitle className="text-xl font-bold leading-tight text-heading">{tutorial.title}</DialogTitle>
              <span className="rounded-full bg-chip px-2.5 py-0.5 text-xs font-semibold text-heading">{tutorial.length}</span>
            </div>
            <DialogDescription className="sr-only">Tutorial video</DialogDescription>
          </div>
          <div className="px-6 py-5">
            {/* Video area: the prototype has no video files, so this is a placeholder player. */}
            <div className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-lg bg-[linear-gradient(135deg,#0B4B66,#1A73E8)]">
              <button
                type="button"
                aria-label={`Play ${tutorial.title}`}
                className="grid size-16 place-items-center rounded-full bg-white/95 text-heading shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
              >
                <CirclePlay className="size-9" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-border px-6 py-4" aria-live="polite">
            {rating ? (
              <p className="text-sm font-medium text-heading">Thanks for your feedback.</p>
            ) : (
              <>
                <p className="text-sm font-medium text-heading">Was this video helpful?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRating("yes")}
                    className="inline-flex items-center gap-1.5 rounded-md border border-primary bg-white px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <ThumbsUp className="size-4" aria-hidden="true" /> Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setRating("no")}
                    className="inline-flex items-center gap-1.5 rounded-md border border-primary bg-white px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <ThumbsDown className="size-4" aria-hidden="true" /> No
                  </button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
