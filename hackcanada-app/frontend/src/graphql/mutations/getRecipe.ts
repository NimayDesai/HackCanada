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

// TypeScript types for the mutation
export interface RecipeInput {
  cuisine: string;
  protein?: number;
  restrictions?: string;
  allergies?: string;
}

export interface RecipeResponse {
  getRecipe: {
    recipe?: string | null;
    error?: string | null;
    metadata?: Record<string, any> | null;
  };
}
