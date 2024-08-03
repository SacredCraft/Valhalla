import { debounce } from "lodash";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

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
        <AddUser setUsers={setValue} ids={value} />
      </div>
      <ScrollArea className="flex flex-col gap-2 border rounded-md p-2">
        {usersList && usersList.length > 0 ? (
          <div className="flex flex-col gap-2">
            {usersList
              .filter((user) => user.username.includes(search))
              .map((user, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user.avatar ?? undefined}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.username}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setValue((prev) => prev?.filter((id) => id !== user.id));
                    }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
          </div>
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

export const AddUser = ({
  ids,
  setUsers,
}: {
  ids: string[] | undefined;
  setUsers: Dispatch<SetStateAction<string[] | undefined>>;
}) => {
  const [search, setSearch] = useState("");

  const { data: users, refetch } = api.users.queryUsers.useQuery({
    username: search,
  });

  const debouncedRefetch = useRef(debounce(refetch, 300));

  useEffect(() => {
    debouncedRefetch.current();
  }, [search]);

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
        <Input
          placeholder="Search users"
          className="h-8"
          value={search}
          onChange={(value) => setSearch(value as string)}
        />
        <ScrollArea className="border rounded-md p-2">
          {users && users.length > 0 ? (
            <div className="flex flex-col gap-2">
              {users.map((user, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user.avatar ?? undefined}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{user.username}</span>
                  </div>
                  {ids?.includes(user.id) ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setUsers((prev) =>
                          prev?.filter((id) => id !== user.id),
                        );
                      }}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setUsers((prev) => [...(prev ?? []), user.id]);
                      }}
                    >
                      Add
                    </Button>
                  )}
                </li>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground min-h-20 flex items-center justify-center">
              No users found
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
