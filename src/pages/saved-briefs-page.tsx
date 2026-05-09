import { Card } from "../components/card";
import { SectionHeading } from "../components/section-heading";

const placeholders = [
  "No saved briefs yet",
  "Offline reading will come later",
  "Pinned destinations can live here next"
];

export function SavedBriefsPage() {
  return (
    <>
      <SectionHeading
        title="Saved Briefs"
        description="A placeholder home for saved destinations, pinned travel notes, and quick return access."
      />

      <Card>
        <div className="space-y-3">
          {placeholders.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-dashed border-border-soft bg-surface-muted/50 px-4 py-4 text-sm text-text-muted"
            >
              {item}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
