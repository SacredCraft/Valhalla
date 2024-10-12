import { usePathname } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { create, createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import valhallaConfig from "@/config";
import { api } from "@/trpc/react";
import { getTemplateByPath } from "@sacred-craft/valhalla-resource";
import {
  ColumnFiltersState,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  Updater,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";

import { RelativePathContext, useResourceContext } from "../../layout.client";
import { SharedHeader } from "../shared/shared-header";
import { BrowserTable } from "./browser-table";
import { BrowserCol } from "./browser-table-columns";
import { BrowserTabs } from "./browser-tabs";
import { CopyCurrentPath } from "./copy-current-path";
import { PasteAction } from "./copy-cut";
import { New } from "./new";
import { SelectedCopyCut } from "./selected-copy-cut";
import { SelectedDelete } from "./selected-delete";
import { Upload } from "./upload";

interface BrowserPersistState {
  copyFiles: string[];
  cutFiles: string[];
  setCopyFiles: Dispatch<string[]>;
  setCutFiles: Dispatch<string[]>;
}

interface BrowserState {
  table?: ReturnType<typeof useReactTable<BrowserCol>>;
  setTable: Dispatch<ReturnType<typeof useReactTable<BrowserCol>>>;

  data: BrowserCol[];
  setData: Dispatch<BrowserCol[]>;

  rowSelection: RowSelectionState;
  setRowSelection: OnChangeFn<RowSelectionState>;

  columnVisibility: VisibilityState;
  setColumnVisibility: OnChangeFn<VisibilityState>;

  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;

  sorting: SortingState;
  setSorting: OnChangeFn<SortingState>;

  refresh: () => void;
}

export const createBrowserPersistStore = (resource: string) =>
  create<BrowserPersistState>()(
    persist(
      (set) => ({
        copyFiles: [],
        cutFiles: [],
        setCopyFiles: (files) => set({ copyFiles: files }),
        setCutFiles: (files) => set({ cutFiles: files }),
      }),
      {
        name: `browser-storage-${resource}`,
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  );

export const createBrowserStore = (
  initialState: Pick<
    BrowserState,
    | "data"
    | "rowSelection"
    | "columnVisibility"
    | "columnFilters"
    | "sorting"
    | "refresh"
  >,
) =>
  createStore<BrowserState>()((set) => ({
    ...initialState,
    setTable: (table) => set({ table }),
    setData: (data) => set({ data }),
    setRowSelection: (rowSelection) =>
      set((state) => ({
        rowSelection: updater(rowSelection, state.rowSelection),
      })),
    setColumnVisibility: (columnVisibility) =>
      set((state) => ({
        columnVisibility: updater(columnVisibility, state.columnVisibility),
      })),
    setColumnFilters: (columnFilters) =>
      set((state) => ({
        columnFilters: updater(columnFilters, state.columnFilters),
      })),
    setSorting: (sorting) =>
      set((state) => ({
        sorting: updater(sorting, state.sorting),
      })),
  }));

export const useBrowserPersistStore = () => {
  const { resource } = useResourceContext();
  const storeRef = useRef<ReturnType<typeof createBrowserPersistStore>>();

  if (!storeRef.current) {
    storeRef.current = createBrowserPersistStore(resource.name);
  }

  return storeRef.current();
};

export type BrowserStoreApi = ReturnType<typeof createBrowserStore>;

export const BrowserStoreContext = createContext<BrowserStoreApi | undefined>(
  undefined,
);

export const BrowserStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<BrowserStoreApi>();

  const { resource } = useResourceContext();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const relativePath = segments.slice(3);

  const { data: files, refetch: refetchFiles } =
    api.files.getResourceFiles.useQuery({
      resource: resource.name,
      relativePath: relativePath.map((i) => decodeURIComponent(i)),
    });

  const realFiles: BrowserCol[] = useMemo(
    () =>
      (files ?? []).map((file) => {
        const template = getTemplateByPath(file.path, resource, valhallaConfig);
        return {
          ...file,
          template,
        };
      }),
    [files, relativePath],
  );

  useEffect(() => {
    storeRef.current?.setState({ data: realFiles });
  }, [realFiles]);

  if (!storeRef.current) {
    storeRef.current = createBrowserStore({
      ...initialState(),
      refresh: () => refetchFiles(),
    });
  }

  return (
    <BrowserStoreContext.Provider value={storeRef.current}>
      {children}
    </BrowserStoreContext.Provider>
  );
};

export const useBrowserStore = <T,>(
  // eslint-disable-next-line no-unused-vars
  selector: (store: BrowserState) => T,
): T => {
  const context = useContext(BrowserStoreContext);

  if (!context) {
    throw new Error(`useBrowserStore must be used within BrowserStoreProvider`);
  }

  return useStore(context, selector);
};

export const BrowserProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const relativePath = segments.slice(3);

  return (
    <RelativePathContext.Provider value={relativePath}>
      <BrowserStoreProvider>{children}</BrowserStoreProvider>
    </RelativePathContext.Provider>
  );
};

export function BrowserPage() {
  return (
    <BrowserProvider>
      <SharedHeader />
      <BrowserTabs
        left={
          <>
            <New />
            <Upload />
            <PasteAction />
            <SelectedDelete />
            <SelectedCopyCut />
          </>
        }
        right={
          <>
            <CopyCurrentPath />
          </>
        }
      />
      <div className="my-2">
        <BrowserTable />
      </div>
    </BrowserProvider>
  );
}

function updater<T>(updater: Updater<T>, currentState: T): T {
  if (typeof updater === "function") {
    // eslint-disable-next-line no-unused-vars
    return (updater as (old: T) => T)(currentState);
  }
  return updater;
}

function initialState(): Pick<
  BrowserState,
  "data" | "rowSelection" | "columnVisibility" | "columnFilters" | "sorting"
> {
  return {
    data: [],
    rowSelection: {},
    columnVisibility: {},
    columnFilters: [],
    sorting: [],
  };
}
