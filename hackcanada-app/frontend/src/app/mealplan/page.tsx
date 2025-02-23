"use client";

import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@apollo/client";
import { ME_QUERY } from "@/graphql/queries/me";
import { useRouter } from "next/navigation";
import { ThreeDot } from "react-loading-indicators";
import { GET_RECIPE_MUTATION } from "@/lib/mutations";
import { parseString } from "@/components/parser";
import toast from "react-hot-toast";
import { SAVE_RECIPE_MUTATION } from "@/graphql/mutations/saveRecipe";
import { parseIngredients } from "@/components/ingredientParser";

const mealPlanSchema = z.object({
  dietaryRestrictions: z.string().nonempty("Dietary Restrictions are required"),
  allergies: z.string().nonempty("Allergies are required"),
  fitnessGoals: z.string().nonempty("Fitness Goals are required"),
  cuisineType: z.string().nonempty("Cuisine Type is required"),
});

type MealPlanFormValues = z.infer<typeof mealPlanSchema>;

export default function Home() {
  const [recipe, setRecipe] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [saveRecipe] = useMutation(SAVE_RECIPE_MUTATION);

  const [getRecipe] = useMutation(GET_RECIPE_MUTATION);

  const { data, loading: userLoading } = useQuery(ME_QUERY);
  const router = useRouter();

  useEffect(() => {
    if (!data?.me && !userLoading) {
      router.push("/account");
    }
  }, [data?.me, userLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MealPlanFormValues>({
    resolver: zodResolver(mealPlanSchema),
    defaultValues: {
      dietaryRestrictions: "",
      allergies: "",
      fitnessGoals: "",
      cuisineType: "",
    },
  });

  const onSubmit: SubmitHandler<MealPlanFormValues> = async (values) => {
    setLoading(true);
    try {
      const { data } = await getRecipe({
        variables: {
          input: {
            cuisine: values.cuisineType,
            restrictions: values.dietaryRestrictions,
            protein: values.fitnessGoals === "muscle-gain" ? 30 : 20, // example protein values
          },
        },
      });

      if (data.getRecipe.error) {
        console.error("Recipe error:", data.getRecipe.error);
      } else {
        setUserInput(data.getRecipe.recipe || "");
        setRecipe(data.getRecipe.metadata.RecipeInstructions || "");

        console.log(data.getRecipe.metadata.RecipeIngredientParts);
        console.log(data.getRecipe.metadata.RecipeIngredientQuantities);
        await saveRecipe({
          variables: {
            input: {
              description: data.getRecipe.metadata.Description || "",
              instructions: data.getRecipe.metadata.RecipeInstructions || "",
              ingredients:
                parseIngredients(
                  data.getRecipe.metadata.RecipeIngredientParts,
                  data.getRecipe.metadata.RecipeIngredientQuantities
                ) || [],
              keywords: data.getRecipe.metadata.Keywords || [],
              name: data.getRecipe.metadata.Name || "",
              image_uri: data.getRecipe.metadata.Images || "",
            },
          },
        });

        toast.success(
          "Recipe generated successfully! It is now saved to your dashboard."
        );
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      toast.error("Error generating recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
            Personalized Meal Plan Generator
          </h1>

          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger
                value="form"
                className="p-1 rounded-sm data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700"
              >
                Fill Out Form
              </TabsTrigger>
              <TabsTrigger
                value="describe"
                className="p-1 rounded-sm data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-700"
              >
                Describe Goals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dietary Restrictions
                  </label>
                  <select
                    {...register("dietaryRestrictions")}
                    className="w-full h-12 px-4 border bg-gray-100 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="">Select...</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="vegan">Vegan</option>
                    <option value="paleo">Paleo</option>
                    <option value="keto">Keto</option>
                    <option value="none">None</option>
                  </select>
                  {errors.dietaryRestrictions && (
                    <p className="text-red-500">
                      {errors.dietaryRestrictions.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Allergies
                  </label>
                  <select
                    {...register("allergies")}
                    className="w-full h-12 px-4 border bg-gray-100 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="">Select...</option>
                    <option value="nuts">Nuts</option>
                    <option value="dairy">Dairy</option>
                    <option value="shellfish">Shellfish</option>
                    <option value="gluten">Gluten</option>
                    <option value="eggs">Eggs</option>
                    <option value="none">None</option>
                  </select>
                  {errors.allergies && (
                    <p className="text-red-500">{errors.allergies.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fitness Goals
                  </label>
                  <select
                    {...register("fitnessGoals")}
                    className="w-full h-12 px-4 border bg-gray-100 border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="">Select...</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="maintain">Maintain</option>
                  </select>
                  {errors.fitnessGoals && (
                    <p className="text-red-500">
                      {errors.fitnessGoals.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cuisine Type
                  </label>
                  <Input
                    {...register("cuisineType")}
                    placeholder="e.g., Italian, Mexican, Japanese"
                    className="bg-gray-100 dark:bg-gray-700"
                  />
                  {errors.cuisineType && (
                    <p className="text-red-500">{errors.cuisineType.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-lime-600 hover:bg-lime-700 text-white"
                >
                  {loading ? (
                    <ThreeDot
                      color="#ffffff"
                      size="medium"
                      text=""
                      textColor=""
                    />
                  ) : (
                    "Generate Meal Plan"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="describe">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your dietary needs, allergies, and goals..."
                className="w-full h-12"
              />
              <Button
                type="submit"
                className="w-full mt-4 bg-lime-600 hover:bg-lime-700 text-white"
                onClick={() => console.log("User Input:", userInput)}
              >
                Generate Meal Plan
              </Button>
            </TabsContent>
          </Tabs>

          {/* Recipe Information Section */}
          <div className="mt-8 p-4 border rounded-lg bg-gray-100 dark:bg-gray-700 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Recipe Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              This is a small showcase of your personalized meal plan, which
              will be displayed in the dashboard with detailed recipes,
              ingredients, and instructions.
            </p>
          </div>
        </CardContent>
      </Card>

      {recipe && (
        <Card className="w-full max-w-md ml-6 h-fit">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Tailor-made Recipe
            </h2>
            <div className="prose dark:prose-invert">
              <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                {parseString(recipe)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
