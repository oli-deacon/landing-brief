import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

import { SectionShell } from "../components/section-shell";

export function AppErrorPage() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? error.status === 404
      ? "Page not found"
      : "Something went wrong"
    : "Something went wrong";

  const description = isRouteErrorResponse(error)
    ? error.status === 404
      ? "The page you were trying to open does not exist in this version of LandingBrief."
      : "LandingBrief hit an unexpected problem while opening this screen."
    : error instanceof Error
      ? error.message
      : "LandingBrief hit an unexpected problem while opening this screen.";

  return (
    <SectionShell id="app-error" title={title} eyebrow="Travel-ready fallback" emphasis="strong">
      <p className="max-w-xl text-sm leading-6 text-text-muted">{description}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link to="/" className="button-primary inline-flex rounded-full px-4 py-3 text-sm font-medium">
          Back to Home
        </Link>
        <Link to="/saved" className="button-secondary inline-flex rounded-full px-4 py-3 text-sm font-medium">
          Open saved items
        </Link>
      </div>
    </SectionShell>
  );
}
