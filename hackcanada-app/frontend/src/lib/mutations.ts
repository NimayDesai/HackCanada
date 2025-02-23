import { gql } from "@apollo/client";

export const GET_RECIPE_MUTATION = gql`
  mutation GetRecipe($input: RecipeInput!) {
    getRecipe(input: $input) {
      recipe
      error
      metadata
    }
  }
`;
