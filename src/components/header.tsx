import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-10 mb-6">
      <div className="rounded-[1.75rem] border border-border-soft bg-surface px-5 py-4 shadow-card backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Mobile briefing app
            </p>
            <Link to="/" className="mt-1 block text-2xl font-semibold tracking-tight text-text-main">
              LandingBrief
            </Link>
          </div>
          <div className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
            Preview
          </div>
        </div>
      </div>
    </header>
  );
}
