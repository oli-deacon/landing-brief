import { Card } from "../components/card";
import { SectionHeading } from "../components/section-heading";

const rows = [
  { label: "Notifications", value: "Placeholder" },
  { label: "Offline downloads", value: "Coming later" },
  { label: "Preferred region", value: "Not set" }
];

export function SettingsPage() {
  return (
    <>
      <SectionHeading
        title="Settings"
        description="A simple placeholder area for preferences, install settings, and future sync options."
      />

      <Card>
        <div className="divide-y divide-border-soft">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-text-main">{row.label}</p>
                <p className="mt-1 text-sm text-text-muted">{row.value}</p>
              </div>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-muted">
                Soon
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
