// The index — a server component listing the recipes. Each link is a same-origin
// navigation, so with clientRouter on the click MORPHS the next recipe into place
// (no reload; the header island's count survives). Still a full, projectable
// document: append .md / .json to any recipe URL.
import { RECIPES } from "./recipes/[slug]/recipes";

export default function Home() {
  const slugs = Object.keys(RECIPES);
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-900/5">
      <h1 className="text-4xl font-extrabold tracking-tight">Recipes</h1>
      <p className="mt-2 text-sm text-stone-400">Click one — the page morphs in, your ♥ count stays.</p>
      <ul className="mt-6 space-y-3">
        {slugs.map((slug) => (
          <li key={slug} className="flex items-baseline gap-2">
            <a href={`/recipes/${slug}`} className="text-lg font-semibold text-amber-700 underline">
              {RECIPES[slug].title}
            </a>
            <span className="text-sm text-stone-400">· serves {RECIPES[slug].serves}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const metadata = { title: "Recipes" };
