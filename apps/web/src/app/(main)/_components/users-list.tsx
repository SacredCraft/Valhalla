import React, { useEffect, useState } from "react";

import { api } from "@/trpc/react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormDescription,
  FormLabel,
  Input,
  ScrollArea,
} from "@sacred-craft/valhalla-components";

export const UsersList = ({
  users,
  setUsers,
}: {
  users: string[];
  // eslint-disable-next-line no-unused-vars
  setUsers: (users: string[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const [value, setValue] = useControllableState<string[]>({
    prop: users,
    onChange: setUsers,
  });

  const { data: usersList, refetch } = api.users.getUsersByIDs.useQuery({
    ids: value ?? [],
  });

  useEffect(() => {
    refetch();
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      <FormLabel>Users</FormLabel>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search users"
          className="h-8"
          value={search}
          onChange={(value) => setSearch(value as string)}
        />
        <AddUser />
      </div>
      <ScrollArea className="flex flex-col gap-2 border rounded-md p-2">
        {usersList && usersList.length > 0 ? (
          usersList
            .filter((user) => user.username.includes(search))
            .map((user, index) => (
              <li key={index} className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src={user.avatar ?? undefined}
                    alt={user.username}
                  />
                  <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <span>{user.username}</span>
                  <span className="text-sm text-gray-500">{user.bio}</span>
                </div>
              </li>
            ))
        ) : (
          <div className="text-sm text-muted-foreground min-h-20 flex items-center justify-center">
            No users found
          </div>
        )}
      </ScrollArea>
      <FormDescription>
        Users that will have this role assigned to them.
      </FormDescription>
    </div>
  );
};

export const AddUser = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Search for a user to add to this role.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
