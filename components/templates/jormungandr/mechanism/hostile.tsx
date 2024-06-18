import { useEditorContext } from "@/app/[plugin]/editor/[...path]/page.client";

import { Enum } from "@/components/form/enum";
import { Node, useNode } from "@/components/form/node";
import { Text } from "@/components/form/text";
import { MechanismProps } from "@/components/templates/jormungandr/jormungandr-default";

export function Hostile({}: MechanismProps) {
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
  const { form } = useEditorContext();
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
