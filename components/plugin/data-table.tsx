"use client";

import { useSetAtom } from "jotai";
import { useEffect, useMemo, useState, useTransition } from "react";

import { File, getFilesByPluginAndDir } from "@/app/actions";
import { PluginDir } from "@/config/plugins";
import { getPluginPath } from "@/lib/cookies";
import { tableAtom } from "@/lib/state";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { HeaderItem, useHeaderContext } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";

import { FileCol, columns } from "./columns";

interface DataTableProps {
  pluginId: string;
  dir: PluginDir;
  current: boolean;
}

export function DataTable({ pluginId, dir, current }: DataTableProps) {
  const [originalData, setOriginalData] = useState<FileCol[]>([]);
  const [data, setData] = useState<FileCol[]>(originalData);
  const [folders, setFolders] = useState<string[]>([]);
  const [seed, setSeed] = useState(0);
  const [pluginPath, setPluginPath] = useState<string>();
  const isRoot = useMemo(() => !folders.length, [folders]);
  const setTable = useSetAtom(tableAtom);

  const { setItems } = useHeaderContext();

  useEffect(() => {
    let beforeHref = `/${pluginId}`;
    let items: HeaderItem[] = [
      {
        label: pluginId ?? "Plugin",
        link: beforeHref,
      },
    ];
    items = [
      ...items,
      ...folders?.map(
        (item) =>
          ({
            label: item,
            link: `${beforeHref}/${item}`,
          }) as HeaderItem,
      ),
    ];
    setItems?.(items);
  }, [folders, pluginId, setItems]);

  useEffect(() => {
    getPluginPath(pluginId).then(setPluginPath);
  }, [pluginId]);

  useEffect(() => {
    setData(originalData);
  }, [originalData]);

  useEffect(() => {
    if (!folders.length) {
      setData(originalData);
      return;
    }
    const folder = folders[folders.length - 1];
    const folderData = originalData.find((item) => item.name === folder);
    setData(folderData?.files || []);
  }, [folders, originalData]);

  const [isPending, startTransition] = useTransition();

  async function getCols(pluginPath: string, dir: PluginDir) {
    function mapFilesToCols(files?: File[]): FileCol[] {
      if (!Array.isArray(files)) {
        return [];
      }
      return files.map((file) => ({
        ...file,
        status: "active",
        files: mapFilesToCols(file.files),
      }));
    }

    return mapFilesToCols(await getFilesByPluginAndDir(pluginPath, dir.id));
  }

  useEffect(() => {
    if (pluginPath) {
      startTransition(() => {
        getCols(pluginPath, dir).then((cols) => {
          setOriginalData(cols);
        });
      });
    }
  }, [seed, pluginPath, dir]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      setData,
      refreshData: () => {
        setSeed((prev) => prev + 1);
      },
      goBack: () => {
        setFolders((prev) => prev.slice(0, -1));
      },
      getPluginPath: () => pluginPath,
      getPluginId: () => pluginId,
      folders,
    },
  });

  useEffect(() => {
    if (current) {
      setTable({
        table,
        isRoot,
      });
    }
  }, [current, table, isRoot, setTable]);

  if (!pluginPath) {
    return (
      <Template dir={dir} count={0} table={table}>
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              PluginPath not found, please configure it first.
            </TableCell>
          </TableRow>
        </TableBody>
      </Template>
    );
  }

  if (isPending) {
    return (
      <Template dir={dir} count={0} table={table}>
        <TableBody>
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              Loading...
            </TableCell>
          </TableRow>
        </TableBody>
      </Template>
    );
  }

  return (
    <Template dir={dir} count={data.length} table={table}>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => {
                if (row.original.dir) {
                  setFolders((prev) => [...prev, row.original.name]);
                }
              }}
              className={cn(
                "h-12",
                row.original.dir &&
                  "cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
              )}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No files found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Template>
  );
}

function Template({
  dir,
  count,
  children,
  table,
}: {
  dir: PluginDir;
  count?: number;
  children: React.ReactNode;
  table: ReturnType<typeof useReactTable<FileCol>>;
}) {
  return (
    <TabsContent value={dir.id} key={dir.id}>
      <Card>
        <CardHeader>
          <CardTitle>{dir.name} Dictionary</CardTitle>
          <CardDescription>
            Manage all the configurations in the {dir.id} dictionary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {children}
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>{count ?? 0}</strong>{" "}
            configurations
          </div>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
