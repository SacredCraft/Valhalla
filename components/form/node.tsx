import { createContext, useContext, useEffect, useState } from "react";

type ContextType = {
  node?: string;
  nodes?: string[];
};

const NodeContext = createContext<ContextType>({});

export const useNode = () => {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error("useNode must be used within a Node");
  }
  return context;
};

export function Node({
  extended = true,
  ...props
}: React.PropsWithChildren<ContextType> & { extended?: boolean }) {
  const { node, nodes } = useNode();

  if (!extended) {
    return (
      <NodeContext.Provider value={{ node: props.node, nodes: props.nodes }}>
        {props.children}
      </NodeContext.Provider>
    );
  }

  const mergedNode =
    props.node && node ? `${node}.${props.node}` : props.node || node;
  const mergedNodes =
    props.nodes && node
      ? props.nodes.map((n) => `${node}.${n}`)
      : props.nodes || nodes;

  return (
    <NodeContext.Provider value={{ node: mergedNode, nodes: mergedNodes }}>
      {props.children}
    </NodeContext.Provider>
  );
}
