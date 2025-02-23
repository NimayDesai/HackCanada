"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ME_QUERY } from "@/graphql/queries/me";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, gql } from "@apollo/client";
import { toast } from "react-hot-toast";

const settingsSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const UPDATE_SETTINGS_MUTATION = gql`
  mutation UpdateSettings($input: UpdateSettingsInput!) {
    updateSettings(input: $input) {
      errors {
        field
        message
      }
      user {
        id
        name
        email
      }
    }
  }
`;

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const { data, loading, error } = useQuery(ME_QUERY);
  const [updateSettings] = useMutation(UPDATE_SETTINGS_MUTATION);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data?.me) {
      router.push("/account");
    }
  }, [data?.me, loading]);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: data?.me?.name || "",
      email: data?.me?.email || "",
    },
  });

  useEffect(() => {
    if (data?.me) {
      form.reset({
        name: data.me.name,
        email: data.me.email,
      });
    }
  }, [data, form]);

  const onSubmit: SubmitHandler<SettingsFormValues> = async (values) => {
    try {
      const { data } = await updateSettings({
        variables: { input: values },
      });

      if (data.updateSettings.errors) {
        toast.error(data.updateSettings.errors[0].message);
        return;
      }

      toast.success("Settings updated successfully");
      setSaved(true);

      setTimeout(() => setSaved(false), 3000); // Reset success message after 3 seconds
    } catch (e) {
      toast.error("Failed to update settings");
      console.log(e);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
            Account Settings
          </h1>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input {...form.register("name")} type="text" />
              {form.formState.errors.name && (
                <p className="text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input {...form.register("email")} type="email" />
              {form.formState.errors.email && (
                <p className="text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input {...form.register("currentPassword")} type="password" />
              {form.formState.errors.currentPassword && (
                <p className="text-red-500">
                  {form.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password (optional)</Label>
              <Input {...form.register("newPassword")} type="password" />
              {form.formState.errors.newPassword && (
                <p className="text-red-500">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-lime-600 hover:bg-lime-700 text-white"
            >
              Save Changes
            </Button>

            {saved && (
              <p className="text-green-500 text-center mt-4">
                Settings updated successfully!
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
