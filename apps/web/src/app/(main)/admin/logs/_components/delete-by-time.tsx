import { CalendarIcon, FileWarning } from "lucide-react";
import React, { useState } from "react";

import { api } from "@/trpc/react";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  cn,
  format,
  toast,
} from "@sacred-craft/valhalla-components";

export const DeleteByTime = ({ refetch }: { refetch: () => void }) => {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const deleteLogsBefore = api.logs.deleteByTime.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Logs deleted");
      refetch();
    },
  });

  const handleDelete = () => {
    if (!date) return;
    deleteLogsBefore.mutate({ time: date });
    setDate(undefined);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="destructive" className="h-7 px-2 ml-auto">
          <FileWarning className="mr-1 h-4 w-4" />
          Delete logs before
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Delete logs before</SheetTitle>
          <SheetDescription>
            Delete logs before a specific date and time.
          </SheetDescription>
        </SheetHeader>
        <form className="py-2">
          <DatePicker date={date} setDate={setDate} />
        </form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleDelete}>
              Delete
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export function DatePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  // eslint-disable-next-line no-unused-vars
  setDate: (date: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
        />
      </PopoverContent>
    </Popover>
  );
}
