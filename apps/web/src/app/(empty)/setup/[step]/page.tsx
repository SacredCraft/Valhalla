import Link from "next/link";
import { redirect } from "next/navigation";

import { Step1 } from "@/app/(empty)/setup/[step]/_components/step-1";
import { Step2 } from "@/app/(empty)/setup/[step]/_components/step-2";
import { db } from "@/server/db";
import { Button } from "@sacred-craft/valhalla-components";

export default async function SetupPage({
  params,
}: {
  params: { step: string };
}) {
  const step = parseInt(params.step, 10);
  const isEmpty = (await db.user.count()) === 0;

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
