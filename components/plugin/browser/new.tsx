import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function New() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2">
          <Plus className="mr-1 h-4 w-4" />
          New
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>New file</SheetTitle>
          <SheetDescription>
            To create a new file, you need to complete the form below.
          </SheetDescription>
        </SheetHeader>
        <form className="my-4">
          <div className="grid gap-4">
            <div className="space-y-1">
              <label htmlFor="type" className="block font-medium text-sm">
                Type
              </label>
              <Select defaultValue="file">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent id="type">
                  <SelectItem value="folder">Folder</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label htmlFor="name" className="block font-medium text-sm">
                Name
              </label>
              <Input
                id="name"
                type="text"
                className="input"
                placeholder="Enter the name of the file"
              />
            </div>
          </div>
        </form>
        <SheetFooter>
          <Button>Submit</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
