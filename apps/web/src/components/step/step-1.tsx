"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useSetupContext } from "@//app/(empty)/setup/[step]/layout.client";
import { Button } from "@//components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@//components/ui/form";
import { Input } from "@//components/ui/input";
import { signInSchema } from "@/lib/zod";
import { setupAdminUser } from "@/server/service/user";
import { zodResolver } from "@hookform/resolvers/zod";

export function Step1() {
  const { setName } = useSetupContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer) {
    setIsLoading(true);

    setupAdminUser(values.username, values.password).then((res) => {
      setIsLoading(false);
      if (res) {
        toast.success("Account created successfully");
        router.push("/setup/2");
      } else {
        toast.error("Failed to create account");
      }
    });
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
