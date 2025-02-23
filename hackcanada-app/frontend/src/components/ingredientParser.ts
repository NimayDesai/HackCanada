export function parseIngredients(ingredients: string, amounts: string): string {
  const ingredientList = ingredients
    .substring(3, ingredients.length - 2)
    .split('", "');

  const amountList = amounts.substring(3, amounts.length - 2).split('", "');

  const combinedList = ingredientList.map((ingredient, index) => {
    const amount = amountList[index];
    const unit = parseFloat(amount) !== 1 ? "cups" : "cup";
    return `${amount} ${unit} of ${ingredient}`;
  });

  return combinedList.join(", ");
}
