"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect } from "react";

import { useSetupContext } from "@/app/(empty)/setup/[step]/layout.client";
import { Button } from "@/app/_components/ui/button";

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
