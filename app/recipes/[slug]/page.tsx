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
    <article>
      <h1>{r.title}</h1>
      <p>Serves {r.serves}</p>
      <h2>Ingredients</h2>
      <ul>{r.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
      <h2>Steps</h2>
      <ol>{r.steps.map((s) => <li key={s}>{s}</li>)}</ol>
    </article>
  ),
  json: (r) => r,                         // GET /recipes/chocolate-cake.json
  md: (r) =>                              // GET /recipes/chocolate-cake.md
    `# ${r.title}\n\nServes ${r.serves}\n\n## Ingredients\n\n` +
    r.ingredients.map((i) => `- ${i}`).join("\n") +
    `\n\n## Steps\n\n` +
    r.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n",
});
