"use client";

<<<<<<< HEAD
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [allergies, setAllergies] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [userInput, setUserInput] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dietary Restrictions:', dietaryRestrictions);
    console.log('Allergies:', allergies);
    console.log('Fitness Goals:', fitnessGoals);
    console.log('Cuisine Type:', cuisineType);
    console.log('User Input:', userInput);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
=======
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  dietaryRestrictions: z.string().nonempty("Dietary Restrictions are required"),
  allergies: z.string().nonempty("Allergies are required"),
  fitnessGoals: z.string().nonempty("Fitness Goals are required"),
  cuisineType: z.string().nonempty("Cuisine Type is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function MealPlanPage() {
  const [userInput, setUserInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 mt-5 bg-gray-50 dark:bg-gray-800">
>>>>>>> 2b26419 (Big changes)
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
            Personalized Meal Plan Generator
          </h1>
<<<<<<< HEAD
          
          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid grid-cols-2 w-full"> 
              <TabsTrigger value="form">Fill Out Form</TabsTrigger>
              <TabsTrigger value="describe">Describe Goals</TabsTrigger>
            </TabsList>
            
            <TabsContent value="form">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dietary Restrictions
                  </label>
                  <select
                    value={dietaryRestrictions}
                    onChange={(e) => setDietaryRestrictions(e.target.value)}
=======

          <Tabs defaultValue="form" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger
                value="form"
                className="p-1 rounded-sm data-[state=active]:bg-gray-100   dark:data-[state=active]:bg-gray-800"
              >
                Fill Out Form
              </TabsTrigger>
              <TabsTrigger
                value="describe"
                className="p-1 rounded-sm data-[state=active]:bg-gray-100 "
              >
                Describe Goals
              </TabsTrigger>
            </TabsList>

            <TabsContent value="form">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mt-5 dark:text-gray-300 mb-1">
                    Dietary Restrictions
                  </label>
                  <select
                    {...register("dietaryRestrictions")}
>>>>>>> 2b26419 (Big changes)
                    className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="">Select...</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="gluten-free">Gluten-Free</option>
                    <option value="vegan">Vegan</option>
                    <option value="paleo">Paleo</option>
                    <option value="keto">Keto</option>
                    <option value="none">None</option>
                  </select>
<<<<<<< HEAD
                </div>
                
=======
                  {errors.dietaryRestrictions && (
                    <p className="text-red-500 text-sm">
                      {errors.dietaryRestrictions.message}
                    </p>
                  )}
                </div>

>>>>>>> 2b26419 (Big changes)
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Allergies
                  </label>
                  <select
<<<<<<< HEAD
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
=======
                    {...register("allergies")}
>>>>>>> 2b26419 (Big changes)
                    className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="">Select...</option>
                    <option value="nuts">Nuts</option>
                    <option value="dairy">Dairy</option>
                    <option value="shellfish">Shellfish</option>
                    <option value="gluten">Gluten</option>
                    <option value="eggs">Eggs</option>
                    <option value="none">None</option>
                  </select>
<<<<<<< HEAD
                </div>
                
=======
                  {errors.allergies && (
                    <p className="text-red-500 text-sm">
                      {errors.allergies.message}
                    </p>
                  )}
                </div>

>>>>>>> 2b26419 (Big changes)
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Fitness Goals
                  </label>
                  <select
<<<<<<< HEAD
                    value={fitnessGoals}
                    onChange={(e) => setFitnessGoals(e.target.value)}
=======
                    {...register("fitnessGoals")}
>>>>>>> 2b26419 (Big changes)
                    className="w-full h-12 px-4 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-300"
                  >
                    <option value="">Select...</option>
                    <option value="weight-loss">Weight Loss</option>
                    <option value="muscle-gain">Muscle Gain</option>
                    <option value="maintain">Maintain</option>
                  </select>
<<<<<<< HEAD
                </div>
                
=======
                  {errors.fitnessGoals && (
                    <p className="text-red-500 text-sm">
                      {errors.fitnessGoals.message}
                    </p>
                  )}
                </div>

>>>>>>> 2b26419 (Big changes)
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cuisine Type
                  </label>
                  <Input
<<<<<<< HEAD
                    value={cuisineType}
                    onChange={(e) => setCuisineType(e.target.value)}
                    placeholder="e.g., Italian, Mexican, Japanese"
                  />
                </div>
                
                <Button type="submit" className="w-full bg-lime-700 text-white">Generate Meal Plan</Button>
              </form>
            </TabsContent>
            
=======
                    {...register("cuisineType")}
                    placeholder="e.g., Italian, Mexican, Japanese"
                  />
                  {errors.cuisineType && (
                    <p className="text-red-500 text-sm">
                      {errors.cuisineType.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full bg-lime-700 text-white">
                  Generate Meal Plan
                </Button>
                <Button
                  type="button"
                  className="w-full mt-4 bg-lime-700 text-white"
                  onClick={() => console.log("User Input:", userInput)}
                >
                  Save Meal Plan
                </Button>
              </form>
            </TabsContent>

>>>>>>> 2b26419 (Big changes)
            <TabsContent value="describe">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your dietary needs, allergies, and goals..."
                className="w-full h-12"
              />
<<<<<<< HEAD
              <Button type="submit" className="w-full mt-4 bg-lime-700 text-white" onClick={() => console.log('User Input:', userInput)}>
                Generate Meal Plan
              </Button>
=======
              <Button
                type="button"
                className="w-full mt-4 bg-lime-700 text-white"
                onClick={() => console.log("User Input:", userInput)}
              >
                Generate Meal Plan
              </Button>

              <Button
                type="button"
                className="w-full mt-4 bg-lime-700 text-white"
                onClick={() => console.log("User Input:", userInput)}
              >
                Save Meal Plan
              </Button>
>>>>>>> 2b26419 (Big changes)
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
<<<<<<< HEAD
=======
      <Card></Card>
>>>>>>> 2b26419 (Big changes)
    </div>
  );
}
