import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home", icon: "⌂" },
  { to: "/saved", label: "Saved", icon: "◫" },
  { to: "/settings", label: "Settings", icon: "⚙" }
];

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 lg:hidden">
      <div className="glass-panel mx-auto flex max-w-md items-center justify-between rounded-[1.9rem] px-2 py-2 sm:max-w-xl">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition",
                isActive
                  ? "bg-accent-soft text-text-main shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-text-muted hover:bg-white/6 hover:text-text-soft"
              ].join(" ")
            }
          >
            <span className="text-base leading-none" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
