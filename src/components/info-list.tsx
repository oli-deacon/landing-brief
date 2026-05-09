import type { ReactNode } from "react";

type InfoListItem = {
  label: string;
  value: ReactNode;
};

type InfoListProps = {
  items: InfoListItem[];
};

export function InfoList({ items }: InfoListProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[1.25rem] border border-border-soft bg-surface-muted/35 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            {item.label}
          </p>
          <div className="mt-2 text-sm leading-6 text-text-main">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
