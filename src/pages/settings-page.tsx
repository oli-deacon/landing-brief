import { SectionHeading } from "../components/section-heading";
import { useAppStatus } from "../lib/app-status";
import { useOfflineLibrary } from "../hooks/use-offline-library";

export function SettingsPage() {
  const { canInstall, installApp, installHint, installInstructions, installLabel, installMethod, isInstalled, isOnline } = useAppStatus();
  const library = useOfflineLibrary();
  const showInstructions = (installMethod === "ios-manual" || installMethod === "ios-open-in-safari") && !isInstalled;

  return (
    <div className="utility-page">
      <SectionHeading title="Settings" description="Keep the travel library ready for the moments you lose signal." />

      <section className="utility-section">
        <div className="utility-section-heading"><p className="eyebrow">Install</p><h2>Keep it close</h2></div>
        <p className="utility-lede">{isInstalled ? "LandingBrief is already installed on this device." : installHint}</p>
        {installMethod === "native-prompt" && canInstall ? <button type="button" onClick={() => { void installApp(); }} className="button-primary mt-5 inline-flex rounded-full px-4 py-3 text-sm font-medium">{installLabel}</button> : null}
        {showInstructions ? <ol className="utility-instructions">{installInstructions.map((instruction) => <li key={instruction}>{instruction}</li>)}</ol> : null}
        {!isInstalled && installMethod === "none" && !canInstall ? <p className="utility-empty mt-5">Install prompt unavailable on this browser right now.</p> : null}
      </section>

      <section className="utility-section">
        <div className="utility-section-heading"><p className="eyebrow">Offline readiness</p><h2>Your device</h2></div>
        <dl className="utility-status-list">
          <StatusRow label="Connectivity" detail={isOnline ? "Online and ready to refresh country data." : "Offline mode is active."} value={isOnline ? "Online" : "Offline"} />
          <StatusRow label="Saved briefs" detail="Pinned destinations available from this device." value={String(library.savedCountries.length)} />
          <StatusRow label="Recent countries" detail="Most recently opened destination briefs." value={String(library.recentCountries.length)} />
          <StatusRow label="Saved notes" detail="Personal reminders stored locally." value={String(Object.keys(library.notes).length)} />
        </dl>
      </section>
    </div>
  );
}

function StatusRow({ label, detail, value }: { label: string; detail: string; value: string }) {
  return <div><dt><strong>{label}</strong><span>{detail}</span></dt><dd>{value}</dd></div>;
}
