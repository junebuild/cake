// A tiny client island in the header. Its only job in this demo is to hold state
// that a MORPH navigation must preserve: click it, navigate between recipes, and
// the count stays — because clientRouter morphs the page in place instead of
// reloading, and islands are opaque (React keeps owning this subtree).
import { useState } from "react";

export function SaveButton() {
  const [n, setN] = useState(0);
  return (
    <button
      type="button"
      onClick={() => setN((v) => v + 1)}
      className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
    >
      <span aria-hidden>♥</span> saved: {n}
    </button>
  );
}
