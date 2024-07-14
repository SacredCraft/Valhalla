import Link from "next/link";
import { redirect } from "next/navigation";

import { Step1 } from "@//components/step/step-1";
import { Step2 } from "@//components/step/step-2";
import { Button } from "@//components/ui/button";
import prisma from "@/lib/prisma";

export default async function SetupPage({
  params,
}: {
  params: { step: string };
}) {
  const step = parseInt(params.step, 10);
  const isEmpty = (await prisma.user.count()) === 0;

  if (!isEmpty && step !== 2) {
    return redirect("/");
  }

  switch (step) {
    case 0:
      return (
        <div className="flex flex-col space-y-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Valhalla
          </h1>
          <p className="text-sm text-muted-foreground mx-auto max-w-[300px]">
            Now that you have the platform installed, let&apos;s get you set up
            with your account..
          </p>
          <Link href="/setup/1">
            <Button>Create Account</Button>
          </Link>
        </div>
      );
    case 1:
      return <Step1 />;
    case 2:
      return <Step2 />;
  }
}
