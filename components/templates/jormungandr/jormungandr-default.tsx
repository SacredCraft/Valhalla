"use client";

import { isFormDeletableValue } from "@/lib/form";

import { ActionsArea } from "@/components/form/areas/actions-area";
import { GroupArea } from "@/components/form/areas/group-area";
import { ListArea, ListItem } from "@/components/form/areas/list-area";
import { ButtonGroup } from "@/components/form/button-group";
import { Enum } from "@/components/form/enum";
import { Node } from "@/components/form/node";
import { Text } from "@/components/form/text";
import { BaseAttack } from "@/components/templates/jormungandr/mechanism/base-attack";
import { Hostile } from "@/components/templates/jormungandr/mechanism/hostile";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function JormungandrDefault() {
  return (
    <div className="space-y-4">
      <GroupArea
        title="Basic Configuration"
        description="Configure the basic information of the item."
      >
        <Node node="type">
          <Text
            label="Type"
            description="Edit the type of the item."
            defaultValue="HUSK"
          />
        </Node>
      </GroupArea>
      <Node node="default">
        <GroupArea
          title="Default"
          description="Configure the default settings."
        >
          <div className="flex md:flex-row flex-col w-full md:items-center items-start md:space-x-4 md:space-y-2 space-y-4">
            <Node node="display-name">
              <Text
                label="Display Name"
                description="Edit the display name of the item."
                defaultValue="我是傻逼"
              />
            </Node>
            <Node node="display-name-visible">
              <ButtonGroup
                label="Display Name Visibility"
                description="Edit the display name visibility of the item."
                defaultValue={true}
              >
                <Button value="true">True</Button>
                <Button value="false">False</Button>
              </ButtonGroup>
            </Node>
          </div>
          <Node node="health">
            <Text
              label="Health"
              description="Edit the health of the item."
              type="number"
              defaultValue={30}
            />
          </Node>

          <GroupArea
            title="Model Configuration"
            description="Edit the model of the item."
          >
            <Node node="model">
              <Enum
                label="Model"
                creatable
                items={[
                  { value: "zenda_bugs", label: "Zenda Bugs" },
                  { value: "azura_bugs", label: "Azura Bugs" },
                ]}
                description="Edit the model of the item."
              />
            </Node>

            <div className="space-y-2">
              <Label className="text-base">Model Options</Label>
              <Node
                node="model-options"
                nodes={["model-options.nametag", "model-options.state-machine"]}
              >
                <ActionsArea className="flex md:flex-row flex-col md:items-center items-start md:space-x-4 md:space-y-0 space-y-4 rounded-lg border p-3">
                  <Node node="nametag">
                    <Text
                      label="Nametag"
                      description="Edit the nametag of the item."
                      defaultValue="yournametag"
                    />
                  </Node>
                  <Node node="state-machine">
                    <ButtonGroup
                      label="State Machine"
                      description="Edit the state machine of the item."
                      defaultValue={true}
                    >
                      <Button value="true">True</Button>
                      <Button value="false">False</Button>
                    </ButtonGroup>
                  </Node>
                </ActionsArea>
              </Node>
            </div>
          </GroupArea>
        </GroupArea>
      </Node>

      <GroupArea
        title="Mechanism"
        description="Configure the mechanism settings."
        defaultCollapsed={false}
      >
        <Node node="mechanism">
          <ListArea
            draggable
            itemKeys={{
              label: ["==", "id"],
            }}
          >
            {({ item }) =>
              getMatchedMechanism({
                item,
              })
            }
          </ListArea>
        </Node>
      </GroupArea>
    </div>
  );
}

export type MechanismProps = {
  item: ListItem;
};

export function getMatchedMechanism({ item }: MechanismProps): React.ReactNode {
  const key: string = item.value?.["=="] ?? item.value?.["id"];
  if (isFormDeletableValue(item)) {
    return <div>Deleted</div>;
  }
  switch (key) {
    case "BASE_ATTACK":
      return <BaseAttack item={item} />;
    case "HOSTILE":
      return <Hostile item={item} />;
    default:
      return <div>Unknown Mechanism</div>;
  }
}
