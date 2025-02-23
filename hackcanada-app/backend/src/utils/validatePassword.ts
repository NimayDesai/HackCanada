import { FieldError } from "../resolvers";

export const validatePassword = (password: string): FieldError | undefined => {
  if (!password) {
    return {
      field: "password",
      message: "No password supplied",
    };
  }

  if (password.length <= 6) {
    return {
      field: "password",
      message: "Password Must be greater than 6 characters",
    };
  }

  return undefined;
};
