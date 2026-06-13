// The route — data in, four surfaces out. The JSX lives in RecipePage; view()
// is a one-line adapter, so this file stays about routing and projection.
import { route } from "@junejs/core/route";

import { RECIPES } from "./recipes";
import { RecipePage } from "./RecipePage";

export default route({
  load: (ctx) => {
    const recipe = RECIPES[ctx.params.slug!];
    if (!recipe) throw new Error("no such recipe");
    return { recipe };
  },
  metadata: ({ recipe }) => ({ title: recipe.title }),

  view: ({ recipe }) => <RecipePage recipe={recipe} />,   // → HTML
  json: ({ recipe }) => recipe,                           // → .json
  md: ({ recipe }) =>                                      // → .md
    `# ${recipe.title}\n\nServes ${recipe.serves}\n\n## Ingredients\n\n` +
    recipe.ingredients.map((i) => `- ${i}`).join("\n") +
    `\n\n## Steps\n\n` +
    recipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n",
});
