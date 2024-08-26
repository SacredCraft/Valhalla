import diff from "fast-diff";
import { useState } from "react";
import * as Y from "yjs";

import { Input, InputProps, cn } from "@sacred-craft/valhalla-components";

import { useRoom } from "../room";
import { useNodeContext } from "./node";

export function useText(ytext: Y.Text) {
  const [text, setText] = useState(ytext.toString());
  ytext.observe(() => {
    setText(ytext.toString());
  });
  const setYText = (textNew: string | undefined) => {
    const delta = diffToDelta(diff(text, textNew || ""));
    ytext.applyDelta(delta);
  };
  return [text, setYText] as const;
}

function diffToDelta(diffResult: diff.Diff[]) {
  return diffResult.map(([op, value]) => {
    switch (op) {
      case diff.INSERT:
        return { insert: value };
      case diff.EQUAL:
        return { retain: value.length };
      case diff.DELETE:
        return { delete: value.length };
      default:
        return null;
    }
  });
}

export const Text = (props: InputProps) => {
  const { provider } = useRoom();
  const { currentPath, focus, blur, focusedUser } = useNodeContext();
  const doc = provider.document;
  const ytext = doc.getText(currentPath);
  const [text, setYText] = useText(ytext);

  return (
    <Input
      id={currentPath}
      type="text"
      value={text}
      onChange={(value) => {
        setYText(value?.toString());
      }}
      onFocus={() => focus()}
      onBlur={() => blur()}
      className={cn("focus-visible:ring-[var(--tw-ring-color)]", {
        "ring-1": focusedUser,
      })}
      style={
        {
          "--tw-ring-color": focusedUser && focusedUser.color,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};
