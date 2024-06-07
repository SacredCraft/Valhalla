import { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";

interface Props {
  attrs?: string;
  renderedHTML?: string;
}

export const ShikiHighLighterWrapper = forwardRef<
  HTMLDivElement,
  PropsWithChildren<Props>
>((props, ref) => {
  const [codeBlockRef, setCodeBlockRef] = useState<HTMLDivElement | null>(null);

  useImperativeHandle(ref, () => codeBlockRef!);

  return (
    <div
      ref={setCodeBlockRef}
      className="relative w-full overflow-auto"
      dangerouslySetInnerHTML={useMemo(
        () =>
          props.renderedHTML
            ? ({
                __html: props.renderedHTML,
              } as any)
            : undefined,
        [props.renderedHTML],
      )}
    >
      {props.children}
    </div>
  );
});

ShikiHighLighterWrapper.displayName = "ShikiHighLighterWrapper";
