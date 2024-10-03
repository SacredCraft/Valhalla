import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { UserAuthForm } from "@/app/(empty)/sign-in/_components/user-auth-form";
import { auth } from "@/server/auth";

import { UserAuthLogo } from "./_components/user-auth-logo";

export const metadata: Metadata = {
  title: "Valhalla | Authentication",
  description: "Authentication page for Valhalla Hub",
};

export default async function AuthenticationPage() {
  const session = await auth();
  if (session) redirect("/");

  const t = await getTranslations("authentication");

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium w-24">
          <UserAuthLogo />
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">&ldquo;{t("testimonial")}&rdquo;</p>
            <footer className="text-sm">LioRael</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {t("sign-in.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("sign-in.description")}
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            {t("sign-in.agreement")}{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t("sign-in.terms-of-service")}
            </Link>{" "}
            {t("sign-in.and")}{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              {t("sign-in.privacy-policy")}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
