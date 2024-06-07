import { atom } from "jotai";

import { Table } from "@tanstack/react-table";

import { FileCol } from "@/components/plugin/columns";

export const tableAtom = atom<{
  table: Table<FileCol>;
  isRoot: boolean;
} | null>(null);
