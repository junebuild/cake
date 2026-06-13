// One route() — four surfaces. The whole demo.
import { route } from "@junejs/core/route";

const RECIPES: Record<string, { title: string; serves: number; ingredients: string[]; steps: string[] }> = {
  "chocolate-cake": {
    title: "Chocolate Cake",
    serves: 8,
    ingredients: [
      "200g dark chocolate", "175g butter", "175g sugar",
      "4 eggs", "100g flour", "1 tsp baking powder", "pinch of salt",
    ],
    steps: [
      "Melt chocolate and butter together.",
      "Whisk eggs with sugar until pale.",
      "Fold in the chocolate, then flour, baking powder, salt.",
      "Bake at 180°C for 25 minutes.",
      "Cool before slicing.",
    ],
  },
};

export default route({
  load: (ctx) => {
    const r = RECIPES[ctx.params.slug!];
    if (!r) throw new Error("no such recipe");
    return r;
  },
  metadata: (r) => ({ title: r.title }),
  view: (r) => (                          // GET /recipes/chocolate-cake → HTML
    <article className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-900/5">
      <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
        Serves {r.serves}
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">{r.title}</h1>

      <h2 className="mt-8 text-xs font-semibold tracking-widest uppercase text-stone-400">Ingredients</h2>
      <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {r.ingredients.map((i) => (
          <li key={i} className="rounded-lg bg-stone-50 px-3 py-2 text-sm">{i}</li>
        ))}
      </ul>

      <h2 className="mt-8 text-xs font-semibold tracking-widest uppercase text-stone-400">Steps</h2>
      <ol className="mt-3 space-y-3">
        {r.steps.map((s, i) => (
          <li key={s} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="leading-6">{s}</span>
          </li>
        ))}
      </ol>
    </article>
  ),
  json: (r) => r,                         // GET /recipes/chocolate-cake.json
  md: (r) =>                              // GET /recipes/chocolate-cake.md
    `# ${r.title}\n\nServes ${r.serves}\n\n## Ingredients\n\n` +
    r.ingredients.map((i) => `- ${i}`).join("\n") +
    `\n\n## Steps\n\n` +
    r.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n",
});
