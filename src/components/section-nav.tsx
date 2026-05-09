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
      <div className="glass-panel flex min-w-max gap-2 rounded-[1.65rem] p-2">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rounded-full border border-transparent bg-white/4 px-3 py-2 text-xs font-medium text-text-muted transition hover:border-border-soft hover:bg-accent-soft hover:text-text-main focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
