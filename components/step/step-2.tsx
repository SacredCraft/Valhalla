"use client";

import { useRouter } from "next/navigation";

import { Circle, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { useSetupContext } from "@/app/(empty)/setup/[step]/layout.client";
import { signInSchema } from "@/lib/zod";
import { createAdminUser } from "@/service/user";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function Step2() {
  const { setName } = useSetupContext();
  const router = useRouter();

  useEffect(() => {
    setName("What's next?");
  }, [setName]);

  return (
    <div className="flex flex-col space-y-6 text-center w-80">
      <h1 className="text-2xl font-semibold tracking-tight">
        What&apos;s next?
      </h1>
      <p className="text-sm text-muted-foreground">
        Tips to help you get started with Valhalla.
      </p>
      <ul className="flex flex-col space-y-4 text-start list-disc list-inside">
        <li className="text-sm text-muted-foreground">
          Create an account to get started with Valhalla.
        </li>
        <li className="text-sm text-muted-foreground">
          Add your first project to start managing your resources.
        </li>
        <li className="text-sm text-muted-foreground">
          Invite your team to collaborate on projects.
        </li>
      </ul>
      <Button onClick={() => router.push("/")} className="w-full">
        Complete
      </Button>
    </div>
  );
}
