// The view ("template") — a plain server component. Lives on its own so it's
// readable, testable, and reusable; the route() just hands it the loaded data.
import type { Recipe } from "./recipes";

export function RecipePage({ recipe }: { recipe: Recipe }) {
  return (
    <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-900/5">
      <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
        Serves {recipe.serves}
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">{recipe.title}</h1>

      <h2 className="mt-8 text-xs font-semibold tracking-widest uppercase text-stone-400">Ingredients</h2>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {recipe.ingredients.map((i) => (
          <li key={i} className="rounded-lg bg-stone-50 px-3 py-2 text-sm">{i}</li>
        ))}
      </ul>

      <h2 className="mt-8 text-xs font-semibold tracking-widest uppercase text-stone-400">Steps</h2>
      <ol className="mt-3 space-y-3">
        {recipe.steps.map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="leading-6">{s}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}
