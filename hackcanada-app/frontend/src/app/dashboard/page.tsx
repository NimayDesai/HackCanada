import React from "react";
import { Card } from "@/components/ui/card";

const RecipeCard = ({
  title,
  ingredients,
}: {
  title: string;
  ingredients: string[];
}) => {
  return (
    <Card className="p-4 mb-4 shadow-lg border rounded-lg">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600">Ingredients: {ingredients.join(", ")}</p>
    </Card>
  );
};

export default function Dashboard() {
  const recipes = [
    {
      title: "Grilled Chicken Salad",
      ingredients: ["Chicken", "Lettuce", "Tomato", "Cucumber"],
    },
    {
      title: "Vegan Tacos",
      ingredients: ["Corn Tortilla", "Beans", "Avocado", "Lettuce"],
    },
  ];

  return (
    <div className="p-6 mt-5">
      <h2 className="mb-6 text-3xl font-bold">Recipe Dashboard</h2>

      <div>
        <h3 className="mb-4 text-2xl font-semibold">Recipes</h3>
        <div className="space-y-4">
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={index}
              title={recipe.title}
              ingredients={recipe.ingredients}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
