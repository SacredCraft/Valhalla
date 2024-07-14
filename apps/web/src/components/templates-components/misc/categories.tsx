"use client";

import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
} from "react";

import { Button } from "@//components/ui/button";
import { cn } from "@/lib/utils";

type ContextType = {
  categories: string[];
  currentCategory: string | null;
  setCategories: Dispatch;
  setCurrentCategory: Dispatch;
};

export const CategoriesContext = createContext<ContextType>({
  categories: [],
  currentCategory: null,
  setCategories: () => {},
  setCurrentCategory: () => {},
});

export const CategoriesProvider: React.FC = ({ children }) => {
  const [currentCategory, setCurrentCategory] = React.useState<string | null>(
    null,
  );
  const [categories, setCategories] = React.useState<string[]>([]);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        currentCategory,
        setCategories,
        setCurrentCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesRoot = ({ children }: { children: React.ReactNode }) => {
  return <CategoriesProvider>{children}</CategoriesProvider>;
};

export const Categories = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-b h-12 flex px-2 justify-between items-center relative">
      <nav className="flex items-center justify-center gap-2 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </nav>
    </div>
  );
};

export const Category = ({
  children,
  category,
  isDefault,
}: {
  children: React.ReactNode;
  category: string;
  isDefault?: boolean;
}) => {
  const { setCurrentCategory, setCategories, currentCategory } =
    useCategories();

  useEffect(() => {
    setCategories((categories) => {
      if (!categories.includes(category)) {
        return [...categories, category];
      }
      return categories;
    });
    if (isDefault && !currentCategory) {
      setCurrentCategory(category);
    }
  }, [category, currentCategory, isDefault, setCategories, setCurrentCategory]);

  return (
    <Button
      size="sm"
      variant={currentCategory === category ? "secondary" : "ghost"}
      className="w-full justify-start h-7"
      onClick={() => setCurrentCategory(category)}
    >
      {children}
    </Button>
  );
};

export const CategoryContent = ({
  children,
  category,
  className,
  title,
  description,
  icon,
}: {
  children: React.ReactNode;
  category: string;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}) => {
  const { currentCategory } = useCategories();

  return currentCategory === category ? (
    <>
      {(title || description || icon) && (
        <div className="border-b flex p-2 items-center space-x-2">
          {icon}
          <div className="space-y-1">
            <h3 className="text-base font-medium">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
      )}
      <div className={cn("p-2", className)}>{children}</div>
    </>
  ) : null;
};
