import React from "react";

import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  TableCell,
} from "@sacred-craft/valhalla-components";
import { Cell, flexRender } from "@tanstack/react-table";

import { RoleCol } from "./resource-roles-table-columns";

export const ResourceRolesEdit = ({ cell }: { cell: Cell<RoleCol, any> }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <TableCell>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Resource Role</SheetTitle>
          <SheetDescription>Edit the resource role below.</SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-2">
          <SheetClose asChild>
            <Button type="submit">Edit</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
