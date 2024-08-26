import { createContext, useContext, useEffect, useMemo } from "react";

import { useRoom } from "../room";

type ContextType = {
  path: string[];
  currentPath: string;
  focus: () => void;
  blur: () => void;
  focusedUser: any;
};

export const NodeContext = createContext<ContextType>({
  path: [],
  currentPath: "",
  focus: () => {},
  blur: () => {},
  focusedUser: null,
});

export const useNodeContext = () => {
  const context = useContext(NodeContext);

  if (!context) {
    throw new Error("useNodeContext must be used within a NodeContext");
  }

  return context;
};

export const Node = ({
  children,
  path: inputPath,
}: {
  children: React.ReactNode;
  path: string[] | string;
}) => {
  const { selfAwareness, setSelfAwareness, otherAwareness } = useRoom();
  const { path: contextPath } = useNodeContext();
  const path = Array.isArray(inputPath) ? inputPath : inputPath.split(".");
  const newPath = [...contextPath, ...path];
  const currentPath = newPath.join(".");
  const focused = selfAwareness.focusedField === currentPath;

  const otherFocusedUser = useMemo(() => {
    return otherAwareness.findLast((user) => user.focusedField === currentPath);
  }, [otherAwareness, currentPath]);

  const focusedUser = focused ? selfAwareness : otherFocusedUser;

  const focus = () => {
    setSelfAwareness({ ...selfAwareness, focusedField: currentPath });
  };

  const blur = () => {
    setSelfAwareness({ ...selfAwareness, focusedField: undefined });
  };

  return (
    <NodeContext.Provider
      value={{ path: newPath, currentPath, focus, blur, focusedUser }}
    >
      {children}
      {contextPath.length === 0 && <InitAwareness />}
    </NodeContext.Provider>
  );
};

const InitAwareness = () => {
  const { setSelfAwareness, user } = useRoom();

  const userAwareness = useMemo(
    () => ({
      name: user.username,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      avatar: user.avatar,
    }),
    [user.username, user.avatar],
  );

  useEffect(() => {
    setSelfAwareness(userAwareness);
  }, [userAwareness]);

  return null;
};
