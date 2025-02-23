import { gql } from "@apollo/client";

export const SAVE_RECIPE_MUTATION = gql`
  mutation ($input: SaveRecipeInput!) {
    saveRecipe(input: $input)
  }
`;
