import { GroupArea } from "@/components/form/areas/group-area";
import { ListArea } from "@/components/form/areas/list-area";
import { ButtonGroup } from "@/components/form/button-group";
import { Node } from "@/components/form/node";
import { Text } from "@/components/form/text";
import {
  MechanismProps,
  getMatchedMechanism,
} from "@/components/templates/jormungandr/jormungandr-default";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function BaseAttack({}: MechanismProps) {
  return (
    <div className="space-y-2">
      <Node node="prepare">
        <GroupArea
          title="Prepare"
          description="Configure the preparation settings."
          defaultCollapsed={false}
        >
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
          <Node node="mech">
            <div className="space-y-2">
              <Label className="text-base">Mechanism</Label>
              <ListArea
                draggable
                itemKeys={{
                  label: ["==", "id"],
                }}
              >
                {({ item }) => getMatchedMechanism({ item })}
              </ListArea>
            </div>
          </Node>
        </GroupArea>
      </Node>

      <Node node="processor">
        <GroupArea
          title="Processor"
          description="Configure the processor settings."
          defaultCollapsed={false}
        >
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
          <Node node="mech">
            <div className="space-y-2">
              <Label className="text-base">Mechanism</Label>
              <ListArea
                draggable
                itemKeys={{
                  label: ["==", "id"],
                }}
              >
                {({ item }) => getMatchedMechanism({ item })}
              </ListArea>
            </div>
          </Node>
        </GroupArea>
      </Node>
      <Node node="trigger">
        <GroupArea
          title="trigger"
          description="Configure the trigger settings."
          defaultCollapsed={false}
        >
          <Node node="chance">
            <Text label="Chance" description="Edit the chance of the item." />
          </Node>
        </GroupArea>
      </Node>
    </div>
  );
}
