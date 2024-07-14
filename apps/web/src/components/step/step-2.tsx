"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";

import { useSetupContext } from "@//app/(empty)/setup/[step]/layout.client";
import { Button } from "@//components/ui/button";

export function Step2() {
  const { setName } = useSetupContext();
  const router = useRouter();

  useEffect(() => {
    setName("What's next?");
  }, [setName]);

  return (
    <div className="flex w-80 flex-col space-y-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        What&apos;s next?
      </h1>
      <p className="text-muted-foreground text-sm">
        Tips to help you get started with Valhalla.
      </p>
      <ul className="flex list-inside list-disc flex-col space-y-4 text-start">
        <li className="text-muted-foreground text-sm">
          Create an account to get started with Valhalla.
        </li>
        <li className="text-muted-foreground text-sm">
          Add your first project to start managing your resources.
        </li>
        <li className="text-muted-foreground text-sm">
          Invite your team to collaborate on projects.
        </li>
      </ul>
      <Button onClick={() => router.push("/")} className="w-full">
        Complete
      </Button>
    </div>
  );
}
