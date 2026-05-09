type SectionNavItem = {
  id: string;
  label: string;
};

type SectionNavProps = {
  items: readonly SectionNavItem[];
};

export function SectionNav({ items }: SectionNavProps) {
  return (
    <nav className="sticky top-[5.75rem] z-10 -mx-1 overflow-x-auto px-1 pb-1 pt-1">
      <div className="flex min-w-max gap-2 rounded-[1.5rem] border border-border-soft bg-surface/95 p-2 shadow-card backdrop-blur-xl">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-full bg-white px-3 py-2 text-xs font-medium text-text-muted transition hover:bg-accent-soft hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
