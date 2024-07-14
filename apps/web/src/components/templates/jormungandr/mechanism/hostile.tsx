import { useFilesEditorContext } from "@//app/(main)/plugins/[plugin]/files/editor/[...path]/layout.client";
import { Enum } from "@//components/templates-components/form/enum";
import { Node, useNode } from "@//components/templates-components/form/node";
import { Text } from "@//components/templates-components/form/text";

export function Hostile() {
  return (
    <div className="space-y-2">
      <Node node="alert">
        <Enum
          label="Alert"
          description="Edit the alert of the item."
          items={[
            {
              label: "Range",
              value: "RANGE",
            },
            {
              label: "Damaged",
              value: "DAMAGED",
            },
          ]}
        />
      </Node>
      <Parameters />
    </div>
  );
}

function Parameters() {
  const { form } = useFilesEditorContext();
  const { node } = useNode();
  const alert = form.watch(`${node}.alert`);

  return (
    alert === "RANGE" && (
      <div className="space-y-2">
        <Node node="range">
          <Text
            label="Range"
            description="Edit the range of the item."
            type="number"
            defaultValue={0}
          />
        </Node>
      </div>
    )
  );
}
