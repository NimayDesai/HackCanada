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
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Define the login schema to match backend expectations
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Define the register schema to match backend RegisterInput
const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

// GraphQL Mutations
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      errors {
        field
        message
      }
      user {
        id
        email
        name
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      errors {
        field
        message
      }
      user {
        id
        email
        name
      }
    }
  }
`;

export default function AuthPage() {
  const router = useRouter();
  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);
  const [error, setError] = useState("");

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signupForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit: SubmitHandler<LoginFormValues> = async (values) => {
    try {
      const { data } = await loginMutation({
        variables: values,
      });

      if (data.login.errors) {
        setError(data.login.errors[0].message);
        return;
      }

      if (data.login.user) {
        toast.success("Successfully logged in");

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (e) {
      setError(`The error ${e} occurred during login`);
    }
  };

  const onSignupSubmit: SubmitHandler<RegisterFormValues> = async (values) => {
    try {
      const { data } = await registerMutation({
        variables: {
          input: {
            name: values.name,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
          },
        },
      });

      if (data.register.errors) {
        setError(data.register.errors[0].message);
        return;
      }

      if (data.register.user) {
        toast.success("Successfully registered");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (e) {
      setError(`The error ${e} occurred during registration.`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          {error && (
            <div className="mb-4 p-2 text-red-500 bg-red-100 rounded">
              {error}
            </div>
          )}
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
                  className="w-full bg-lime-700 hover:bg-lime-800 text-white"
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    {...signupForm.register("name")}
                    placeholder="John Doe"
                  />
                  {signupForm.formState.errors.name && (
                    <p className="text-red-500">
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...signupForm.register("email")}
                    placeholder="user@example.com"
                    type="email"
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-red-500">
                      {signupForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input {...signupForm.register("password")} type="password" />
                  {signupForm.formState.errors.password && (
                    <p className="text-red-500">
                      {signupForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    {...signupForm.register("confirmPassword")}
                    type="password"
                  />
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-red-500">
                      {signupForm.formState.errors.confirmPassword.message}
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
