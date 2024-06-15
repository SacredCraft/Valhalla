import { motion } from "framer-motion";
import { useContext } from "react";

import { EditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import { getFormValue } from "@/lib/form";

import { GroupArea } from "@/components/form/areas/group-area";
import { ListArea } from "@/components/form/areas/list-area";
import { ButtonGroup } from "@/components/form/button-group";
import { Text } from "@/components/form/text";
import {
  DeleteButton,
  MechanismProps,
  TempDeleteButton,
  getMatchedMechanism,
} from "@/components/templates/jormungandr/jormungandr-default";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function BaseAttack({ item, index }: MechanismProps) {
  const handleTapStart = (event: any) => {
    event.stopPropagation();
  };

  const node = `mechanism.${index}`;
  const { form } = useContext(EditorContext);

  return (
    <motion.div className="space-y-2" onTapStart={handleTapStart}>
      <GroupArea
        title="Prepare"
        description="Configure the preparation settings."
        defaultCollapsed={false}
      >
        <ButtonGroup
          node={`${node}.prepare.interrupt`}
          label="Interrupt"
          description="Edit the interrupt of the item."
          defaultValue={true}
        >
          <Button value="true">True</Button>
          <Button value="false">False</Button>
        </ButtonGroup>
        <Text
          node={`${node}.prepare.duration`}
          label="Duration"
          description="Edit the duration of the item."
          type="number"
          defaultValue={0}
        />
        <div className="space-y-2">
          <Label className="text-base">Mechanism</Label>
          <ListArea
            node={`${node}.prepare.mech`}
            labelKey={(item) =>
              getFormValue(item)?.["id"] ?? getFormValue(item)?.["=="]
            }
            draggable
          >
            {({ item, items, labelKey, index }) => (
              <div className="space-y-4">
                {getMatchedMechanism({ item, labelKey, index })}
                <div className="flex">
                  <div className="ml-auto flex gap-2">
                    <TempDeleteButton
                      node={`${node}.prepare.mech`}
                      form={form}
                      items={items}
                      item={item}
                    />
                    <DeleteButton
                      node={`${node}.prepare.mech`}
                      form={form}
                      items={items}
                      item={item}
                    />
                  </div>
                </div>
              </div>
            )}
          </ListArea>
        </div>
      </GroupArea>
      <GroupArea
        title="Processor"
        description="Configure the processor settings."
        defaultCollapsed={false}
      >
        <Text
          node={`${node}.processor.range`}
          label="Range"
          description="Edit the range of the item."
          type="number"
          defaultValue={0}
        />
        <Text
          node={`${node}.processor.angle`}
          label="Angle"
          description="Edit the angle of the item."
          type="number"
          defaultValue={0}
        />
      </GroupArea>
      <GroupArea
        title="trigger"
        description="Configure the trigger settings."
        defaultCollapsed={false}
      >
        <Text
          node={`${node}.trigger.chance`}
          label="Chance"
          description="Edit the chance of the item."
        />
      </GroupArea>
    </motion.div>
  );
}
