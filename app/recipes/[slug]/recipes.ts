// The data ("model"). In a real app this is your DB query; here it's a map so
// the demo runs with no setup.
export type Recipe = { title: string; serves: number; ingredients: string[]; steps: string[] };

export const RECIPES: Record<string, Recipe> = {
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
  "carrot-cake": {
    title: "Carrot Cake",
    serves: 10,
    ingredients: [
      "250g grated carrot", "200g brown sugar", "200ml sunflower oil",
      "3 eggs", "200g flour", "2 tsp cinnamon", "1 tsp baking soda", "100g walnuts",
    ],
    steps: [
      "Whisk eggs, sugar, and oil until smooth.",
      "Stir in the grated carrot and walnuts.",
      "Fold in flour, cinnamon, and baking soda.",
      "Bake at 170°C for 40 minutes.",
      "Top with cream-cheese frosting once cool.",
    ],
  },
};
