import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function New() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="sm" className="h-8">
          <Plus className="mr-2 h-4 w-4" />
          New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>File</DropdownMenuItem>
        <DropdownMenuItem>Folder</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
