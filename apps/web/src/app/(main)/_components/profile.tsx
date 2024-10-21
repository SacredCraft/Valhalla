import { motion } from "framer-motion";
import { Ellipsis } from "lucide-react";
import { signOut } from "next-auth/react";
import React from "react";

import { useAside } from "@/app/(main)/_components/aside";
import { ProfileModel } from "@/app/(main)/_components/profile-model";
import { useProfile } from "@/app/(main)/layout.client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
} from "@sacred-craft/valhalla-components";

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
            "flex h-9 w-9 items-center justify-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 gap-2",
            collapsed ? "md:w-8 md:h-8 p-0" : "p-2 md:h-16 md:w-full",
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
                "flex-col items-start justify-between h-full",
                collapsed ? "hidden" : "flex",
              )}
            >
              <motion.span
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {username}
              </motion.span>
              <Badge
                className="py-[1px] px-1.5"
                variant={role === "ADMIN" ? "default" : "outline"}
              >
                {role}
              </Badge>
            </motion.div>
            <motion.div
              className={cn(
                "items-center h-full ml-auto",
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
        <DropdownMenuItem
          onClick={() =>
            signOut({
              callbackUrl: process.env.NEXT_PUBLIC_SIGN_OUT_REDIRECT_URL,
            })
          }
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
