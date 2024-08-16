import { Redo, Undo } from "lucide-react";
import { editor } from "monaco-editor";

import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@sacred-craft/valhalla-components";

export const MonacoBasicToolbar = ({
  editor,
}: {
  editor: editor.IStandaloneCodeEditor;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="size-7 p-0 px-0 py-0"
            onClick={() => editor.trigger("", "undo", null)}
          >
            <Undo className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="size-7 p-0 px-0 py-0"
            onClick={() => editor.trigger("", "redo", null)}
          >
            <Redo className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo</TooltipContent>
      </Tooltip>
    </div>
  );
};
