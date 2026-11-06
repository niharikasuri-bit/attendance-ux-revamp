// "Not sure how to …?" prompt with a Watch a Tutorial button, opening the Help Center's tutorials.
import { Link } from "react-router-dom";
import { CirclePlay } from "lucide-react";

export function TutorialPrompt({ question }) {
  return (
    <div className="min-w-0 max-w-full md:shrink-0">
      <p className="text-sm font-semibold text-heading">{question}</p>
      <Link
        to="/attendance/help?type=videos"
        className="mt-1.5 inline-flex items-center gap-2 rounded-md border border-primary bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
      >
        <CirclePlay className="size-4" aria-hidden="true" />
        Watch a Tutorial
      </Link>
    </div>
  );
}
