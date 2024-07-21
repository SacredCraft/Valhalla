"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useSetupContext } from "@/app/(empty)/setup/[step]/layout.client";
import { signInSchema } from "@/lib/zod";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from "@sacred-craft/valhalla-components";

export function Step1() {
  const { setName } = useSetupContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const setupAdminUser = api.users.setupAdminUser.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/setup/2");
    },
    onError: () => {
      toast.error("Failed to create account");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    setupAdminUser.mutate(values);
  }

  useEffect(() => {
    setName("Create Account");
  }, [setName]);

  return (
    <div className="flex flex-col space-y-6 text-center w-72">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2 text-start">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="LioRael"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the username for the admin account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be the password for the admin account.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              )}
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
