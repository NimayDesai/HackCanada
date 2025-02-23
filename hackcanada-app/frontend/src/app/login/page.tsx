"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  height: z.coerce.number().min(50),
  weight: z.coerce.number().min(10),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [] = useState("");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      height: undefined,
      weight: undefined,
    },
  });

  const onLoginSubmit: SubmitHandler<LoginFormValues> = (values) => {
    console.log("Login:", values);
  };

  const onSignupSubmit: SubmitHandler<SignupFormValues> = (values) => {
    console.log("Signup:", values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
            Welcome to NutriMind
          </h1>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-5">
              <TabsTrigger
                value="login"
                className="p-1 rounded-sm data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
              >
                Log In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="p-1 rounded-sm data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-gray-800"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...loginForm.register("email")}
                    placeholder="user@example.com"
                    type="email"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-red-500">
                      {loginForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input {...loginForm.register("password")} type="password" />
                  {loginForm.formState.errors.password && (
                    <p className="text-red-500">
                      {loginForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-lime-700 hover:bg-gray-100 hover:dark:bg-gray-800 text-white"
                >
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form
                onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...signupForm.register("email")}
                    placeholder="user@example.com"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input {...signupForm.register("password")} type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    {...signupForm.register("height", { valueAsNumber: true })}
                    placeholder="e.g. 170"
                    type="number"
                  />
                  {signupForm.formState.errors.height && (
                    <p className="text-red-500">
                      {signupForm.formState.errors.height.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    {...signupForm.register("weight", { valueAsNumber: true })}
                    placeholder="e.g. 70"
                    type="number"
                  />
                  {signupForm.formState.errors.weight && (
                    <p className="text-red-500">
                      {signupForm.formState.errors.weight.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-lime-700 hover:bg-gray-100 hover:dark:bg-gray-800 text-white"
                >
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
