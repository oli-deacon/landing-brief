import { useEffect, useRef, useState } from "react";

// Selection-driven split flaps, inspired by React Bits' Split Flap Text.
// Keep the accessible label stable while the decorative characters turn.
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FLIP_MS = 90;
const STAGGER_MS = 22;
const TURNS = 3;

type Tile = { from: string; to: string; turn: number; moving: boolean };
const settledTiles = (text: string): Tile[] => Array.from(text, (char) => ({ from: char, to: char, turn: 0, moving: false }));

export function SplitFlapText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const target = text.toUpperCase();
  const [tiles, setTiles] = useState(() => settledTiles(target));
  const current = useRef("");
  const generation = useRef(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let cancelled = false;
    const run = ++generation.current;
    const previous = current.current.padEnd(target.length, " ");
    const initialDelay = current.current ? 0 : delay;
    const start = performance.now() + initialDelay;
    let lastStep = "";

    function settle() {
      current.current = target;
      cancelled = true;
      cancelAnimationFrame(frame);
      setTiles(settledTiles(target));
    }

    function tick(now: number) {
      if (cancelled) return;
      current.current = target;
      let moving = false;
      const next = Array.from(target, (char, index): Tile => {
        const from = previous[index] ?? " ";
        if (from === char || char === " ") return { from: char, to: char, turn: 0, moving: false };
        const step = Math.floor((now - start - index * STAGGER_MS) / FLIP_MS);
        if (step >= TURNS) return { from: char, to: char, turn: TURNS, moving: false };
        moving = true;
        if (step < 0) return { from, to: from, turn: -1, moving: false };
        const intermediate = (n: number) => ALPHABET[(index * 7 + n * 11 + run) % ALPHABET.length];
        return { from: step === 0 ? from : intermediate(step - 1), to: step === TURNS - 1 ? char : intermediate(step), turn: step, moving: true };
      });
      const signature = next.map((tile) => `${tile.turn}:${tile.moving}`).join("|");
      if (signature !== lastStep) {
        lastStep = signature;
        setTiles(next);
      }
      if (moving) frame = requestAnimationFrame(tick);
    }

    if (media.matches) settle();
    else frame = requestAnimationFrame(tick);
    const onMotionChange = () => { if (media.matches) settle(); };
    media.addEventListener("change", onMotionChange);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      media.removeEventListener("change", onMotionChange);
    };
  }, [target, delay]);

  return (
    <span className={`board-flaps ${className}`}>
      <span className="sr-only">{text}</span>
      <span className="board-flaps-visual" aria-hidden="true">
        {tiles.map((tile, index) => (
          <span className="board-flap" key={index}>
            <span className="board-flap-half board-flap-top"><span>{tile.to}</span></span>
            <span className="board-flap-half board-flap-bottom"><span>{tile.moving ? tile.from : tile.to}</span></span>
            {tile.moving ? <span key={`${generation.current}-${tile.turn}`} className="board-flap-motion">
              <span className="board-flap-half board-flap-front"><span>{tile.from}</span></span>
              <span className="board-flap-half board-flap-back"><span>{tile.to}</span></span>
            </span> : null}
          </span>
        ))}
      </span>
    </span>
  );
}
