// The route — data in, four surfaces out. The default export is the view; named
// exports configure the rest. The JSX lives in RecipePage; this file stays
// about routing and projection.
import type { RouteContext, Loaded } from "@junejs/core/route";

import { RECIPES } from "./recipes";
import { RecipePage } from "./RecipePage";

export const loader = (ctx: RouteContext<{ slug: string }>) => {
  const recipe = RECIPES[ctx.params.slug];
  if (!recipe) throw new Error("no such recipe");
  return { recipe };
};

export default function Page({ recipe }: Loaded<typeof loader>) {   // → HTML
  return <RecipePage recipe={recipe} />;
}

export const metadata = ({ recipe }: Loaded<typeof loader>) => ({ title: recipe.title });

export const json = ({ recipe }: Loaded<typeof loader>) => recipe;   // → .json

export const md = ({ recipe }: Loaded<typeof loader>) =>             // → .md
  `# ${recipe.title}\n\nServes ${recipe.serves}\n\n## Ingredients\n\n` +
  recipe.ingredients.map((i) => `- ${i}`).join("\n") +
  `\n\n## Steps\n\n` +
  recipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n";
