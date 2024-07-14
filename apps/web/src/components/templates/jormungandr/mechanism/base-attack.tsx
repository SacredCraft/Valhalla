import { Button } from "@/app/_components/ui/button";
import { Label } from "@/app/_components/ui/label";

import { ListArea } from "@/components/templates-components/areas/list-area";
import { ButtonGroup } from "@/components/templates-components/form/button-group";
import { Node } from "@/components/templates-components/form/node";
import { Text } from "@/components/templates-components/form/text";
import { getMatchedMechanism } from "@/components/templates/jormungandr/jormungandr-default";

export function BaseAttack({}) {
  return (
    <div className="space-y-2">
      <Node node="prepare">
        <Node node="interrupt">
          <ButtonGroup
            label="Interrupt"
            description="Edit the interrupt of the item."
            defaultValue={true}
          >
            <Button value="true">True</Button>
            <Button value="false">False</Button>
          </ButtonGroup>
        </Node>
        <Node node="duration">
          <Text
            label="Duration"
            description="Edit the duration of the item."
            type="number"
            defaultValue={0}
          />
        </Node>
      </Node>

      <Node node="processor">
        <Node node="range">
          <Text
            label="Range"
            description="Edit the range of the item."
            type="number"
            defaultValue={0}
          />
        </Node>
        <Node node="angle">
          <Text
            label="Angle"
            description="Edit the angle of the item."
            type="number"
            defaultValue={0}
          />
        </Node>
      </Node>
      <Node node="trigger">
        <Node node="chance">
          <Text label="Chance" description="Edit the chance of the item." />
        </Node>
      </Node>
    </div>
  );
}
