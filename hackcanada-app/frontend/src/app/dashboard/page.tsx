"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
// import { Heart } from "lucide-react";
import { ME_QUERY } from "@/graphql/queries/me";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_USER_RECIPES_QUERY } from "@/graphql/queries/getUserRecipes";
import { parseString } from "@/components/parser";

const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 z-10">
        <button
          className="absolute top-2 right-2 text-gray-500 dark:text-white hover:text-gray-700 dark:hover:text-gray-100"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const RecipeCard = ({
  title,
  ingredients,
  instructions,
  // image,
  keywords,
}: // liked,
// onLikeToggle,
{
  title: string;
  ingredients: string[];
  instructions: string;
  // image?: string;
  keywords: string[];
  // liked: boolean;
  // onLikeToggle: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="p-4 shadow-lg border rounded-lg flex w-[500px] min-w-[500px] h-60 transition-transform transform hover:scale-105">
        <div className="flex-1 overflow-hidden">
          <h3 className="text-xl font-bold">
            {!!title
              ? title
                  .replace(/&apos;/g, "'")
                  .replace(/&quot;/g, '"')
                  .replace(/&amp;/g, "&")
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">")
              : "Appetizing Food"}
          </h3>
          {keywords && keywords[0] ? (
            <div className="mt-3 text-sm text-gray-500">{keywords[0]}</div>
          ) : (
            <></>
          )}

          <p className="mt-2 text-gray-700 overflow-hidden dark:text-gray-300">
            Ingredients: {ingredients}
          </p>
        </div>
        <button onClick={openModal} className="ml-2">
          Open Recipe
        </button>
        {/* <button onClick={onLikeToggle} className="ml-2">
          <Heart
            className={`w-6 h-6 ${
              liked ? "text-lime-500 fill-lime-500" : "text-gray-400 fill-none"
            }`}
            stroke={liked ? "none" : "#B0B0B0"} // Border color when not liked
          />
        </button> */}
      </Card>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Instructions</h2>
            <p className="text-gray-700 dark:text-white">
              {parseString(instructions)}
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

export default function Dashboard() {
  const [likedRecipes, setLikedRecipes] = useState<number[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [response, setResponse] = useState<any[]>([]);

  const { data, loading } = useQuery(ME_QUERY);
  const { data: recipes2 } = useQuery(GET_USER_RECIPES_QUERY);
  const router = useRouter();

  useEffect(() => {
    if (!data?.me && !loading) {
      router.push("/account");
    }
  }, [data?.me, loading]);

  useEffect(() => {
    if (data?.me && recipes2?.getUserRecipes) {
      setResponse(recipes2.getUserRecipes);
      console.log(recipes2.getUserRecipes);
    }
  }, [data?.me, recipes2?.getUserRecipes]);

  // const toggleLike = (index: number) => {
  //   setLikedRecipes((prev) =>
  //     prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
  //   );
  // };

  return (
    <div className="p-6 mt-5">
      <h2 className="mb-6 text-3xl font-bold">Recipe Dashboard</h2>
      <div>
        <h3 className="mb-4 text-2xl font-semibold">Recipes</h3>
        <div className="flex space-x-4 overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-gray-300">
          {likedRecipes.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-2xl font-semibold">Liked Recipes</h3>
              <div className="flex space-x-4 overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-gray-300">
                {likedRecipes.map((index) => (
                  <RecipeCard
                    key={index}
                    title={response[index].Name}
                    ingredients={response[index].ingredients}
                    instructions={response[index].instructions}
                    // image={response[index].image}
                    keywords={response[index].keywords}
                    // liked={true}
                    // onLikeToggle={() => toggleLike(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {response &&
        response?.map((recipe, index) => (
          <RecipeCard
            key={index}
            title={recipe.name}
            ingredients={recipe.ingredients}
            instructions={recipe.instructions}
            // image={recipe.image_uri}
            keywords={recipe.Keywords}
            // liked={likedRecipes.includes(index)}
            // onLikeToggle={() => toggleLike(index)}
          />
        ))}
    </div>
  );
}
