import { gql } from "@apollo/client";

export const GET_USER_RECIPES_QUERY = gql`
  query {
    getUserRecipes {
      id
      ingredients
      image_uri
      instructions
      keywords
      name
    }
  }
`;
