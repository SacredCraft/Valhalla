import { motion } from "framer-motion";
import { Ellipsis } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

import { useProfile } from "@//app/(main)/layout.client";
import { useAside } from "@//components/layout/aside";
import { ProfileModel } from "@//components/layout/profile-model";
import { Avatar, AvatarFallback, AvatarImage } from "@//components/ui/avatar";
import { Badge } from "@//components/ui/badge";
import { Button } from "@//components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@//components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type AvatarProps = {
  className?: string;
};

export function Profile({ className }: AvatarProps) {
  const { collapsed } = useAside();
  const { avatar: url, username, role } = useProfile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className={cn(
            "text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-start gap-2 rounded-lg transition-colors md:h-8",
            collapsed ? "p-0 md:h-8 md:w-8" : "p-2 md:h-16 md:w-full",
            className,
          )}
          asChild
        >
          <motion.button
            layout
            style={{
              borderRadius: "12px",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Avatar className={cn(collapsed ? "size-full" : "size-12")} asChild>
              <motion.span layout="position">
                <AvatarImage src={url ?? ""} alt={username} />
                <AvatarFallback>{username?.slice(0, 2)}</AvatarFallback>
              </motion.span>
            </Avatar>
            <motion.div
              className={cn(
                "h-full flex-col items-start justify-between",
                collapsed ? "hidden" : "flex",
              )}
            >
              <motion.span
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {username}
              </motion.span>
              <Badge
                className="px-1.5 py-[1px]"
                variant={role === "ADMIN" ? "default" : "outline"}
              >
                {role}
              </Badge>
            </motion.div>
            <motion.div
              className={cn(
                "ml-auto h-full items-center",
                collapsed ? "hidden" : "flex",
              )}
            >
              <Ellipsis className="size-5" />
            </motion.div>
          </motion.button>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" sideOffset={6}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ProfileModel />
        <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
