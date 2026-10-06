import { useEffect, useRef, useState } from "react";

const topics = [
  ["arrive", "Entry"], ["move", "Transport"], ["settle", "Money"],
  ["connectivity", "Connectivity"], ["food", "Food"], ["phrases", "Phrases"],
  ["quick-facts", "Quick facts"], ["emergency", "Help & notes"]
] as const;

export function BriefContents() {
  const [active, setActive] = useState<string>("arrive");
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = document.querySelector("header");
    const measure = () => {
      const headerHeight = header?.getBoundingClientRect().height ?? 0;
      const navHeight = nav.current?.getBoundingClientRect().height ?? 0;
      document.documentElement.style.setProperty("--brief-header-height", `${headerHeight}px`);
      document.documentElement.style.setProperty("--brief-scroll-offset", `${headerHeight + navHeight + 16}px`);
    };
    const resize = new ResizeObserver(measure);
    if (header) resize.observe(header);
    if (nav.current) resize.observe(nav.current);
    measure();
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const offset = (header?.getBoundingClientRect().height ?? 0) + (nav.current?.getBoundingClientRect().height ?? 0) + 24;
        let current: string = topics[0][0];
        for (const [id] of topics) {
          if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= offset) current = id;
        }
        if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = "emergency";
        setActive(current);
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      document.documentElement.style.removeProperty("--brief-header-height");
      document.documentElement.style.removeProperty("--brief-scroll-offset");
    };
  }, []);

  return <nav ref={nav} className="brief-contents" aria-label="Full brief contents">
    <span className="brief-contents-label">In this brief</span>
    <div className="brief-contents-links">
      {topics.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}>{label}</a>)}
    </div>
  </nav>;
}
