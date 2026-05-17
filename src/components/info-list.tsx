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
          className="rounded-[1.2rem] border border-border-soft/80 bg-[rgba(11,19,29,0.28)] p-4"
        >
          <p className="eyebrow">{item.label}</p>
          <div className="mt-2 text-sm leading-6 text-text-main">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
