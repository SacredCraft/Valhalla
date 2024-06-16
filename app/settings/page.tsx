"use client";

import Link from "next/link";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { savePath } from "@/app/actions";
import { plugins } from "@/config/plugins";
import { getPluginPath } from "@/lib/cookies";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Settings() {
  return (
    <div className="grid gap-6">
      <div className="mx-auto grid w-full gap-2">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>
      <div className="mx-auto grid w-full items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link href="#" className="font-semibold text-primary">
            PluginPaths
          </Link>
        </nav>
        <div className="grid gap-6">
          {plugins.map((plugin) => (
            <form key={plugin.id} action={savePath}>
              <Card>
                <CardHeader>
                  <CardTitle>{plugin.name} Path</CardTitle>
                  <CardDescription>
                    Configure the path where {plugin.name} will be edit.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PathInput pluginId={plugin.id} />
                  <Input type="hidden" name="pluginId" value={plugin.id} />
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button type="submit" onClick={() => toast.success("Saved!")}>
                    Save
                  </Button>
                </CardFooter>
              </Card>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}

function PathInput({ pluginId }: { pluginId: string }) {
  const [path, setPath] = useState<string>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      getPluginPath(pluginId).then((path) => {
        setPath(path);
      });
    });
  }, [pluginId]);

  return isPending ? (
    <Skeleton className="h-8 w-full" />
  ) : (
    <Input
      name="path"
      placeholder={`/server/plugins/${pluginId}`}
      defaultValue={path}
    />
  );
}
