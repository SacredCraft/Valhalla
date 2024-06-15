"use client";

import { useContext } from "react";
import { useForm } from "react-hook-form";

import { EditorContext } from "@/app/[plugin]/editor/[...path]/page.client";
import {
  getFormValue,
  isFormDeletableValue,
  setFormDeleteValue,
} from "@/lib/form";

import { ActionsArea } from "@/components/form/areas/actions-area";
import { GroupArea } from "@/components/form/areas/group-area";
import { ListArea } from "@/components/form/areas/list-area";
import { ButtonGroup } from "@/components/form/button-group";
import { Enum } from "@/components/form/enum";
import { Text } from "@/components/form/text";
import { BaseAttack } from "@/components/templates/jormungandr/mechanism/base-attack";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function JormungandrDefault() {
  const { form } = useContext(EditorContext);

  return (
    <div className="space-y-4">
      <GroupArea
        title="Basic Configuration"
        description="Configure the basic information of the item."
      >
        <Text
          node="type"
          label="Type"
          description="Edit the type of the item."
          defaultValue="HUSK"
        />
      </GroupArea>
      <GroupArea title="Default" description="Configure the default settings.">
        <div className="flex md:flex-row flex-col w-full md:items-center items-start md:space-x-4 md:space-y-2 space-y-4">
          <Text
            node="default.display-name"
            label="Display Name"
            description="Edit the display name of the item."
            defaultValue="我是傻逼"
          />
          <ButtonGroup
            node="default.display-name-visible"
            label="Display Name Visibility"
            description="Edit the display name visibility of the item."
            defaultValue={true}
          >
            <Button value="true">True</Button>
            <Button value="false">False</Button>
          </ButtonGroup>
        </div>
        <Text
          node="default.health"
          label="Health"
          description="Edit the health of the item."
          type="number"
          defaultValue={30}
        />

        <GroupArea
          title="Model Configuration"
          description="Edit the model of the item."
        >
          <Enum
            node="default.model"
            label="Model"
            items={[
              { value: "zenda_bugs", label: "Zenda Bugs" },
              { value: "azura_bugs", label: "Azura Bugs" },
            ]}
            description="Edit the model of the item."
          />

          <div className="space-y-2">
            <Label className="text-base">Model Options</Label>
            <ActionsArea
              className="flex md:flex-row flex-col md:items-center items-start md:space-x-4 md:space-y-0 space-y-4 rounded-lg border p-3"
              nodes={[
                "default.model-options.nametag",
                "default.model-options.state-machine",
              ]}
            >
              <Text
                node="default.model-options.nametag"
                label="Nametag"
                description="Edit the nametag of the item."
                defaultValue="yournametag"
              />
              <ButtonGroup
                node="default.model-options.state-machine"
                label="State Machine"
                description="Edit the state machine of the item."
                defaultValue={true}
              >
                <Button value="true">True</Button>
                <Button value="false">False</Button>
              </ButtonGroup>
            </ActionsArea>
          </div>
        </GroupArea>
      </GroupArea>

      <GroupArea
        title="Mechanism"
        description="Configure the mechanism settings."
        defaultCollapsed={false}
      >
        <ListArea
          node="mechanism"
          labelKey={(item) => item?.["id"] ?? item?.["=="]}
          draggable
          footer={({ items }) => (
            <Button
              onClick={() =>
                form?.setValue("mechanism", [...items, { "==": "NEW" }])
              }
            >
              Add a mechanism
            </Button>
          )}
        >
          {({ item, items, labelKey, index }) => (
            <div className="space-y-4">
              {getMatchedMechanism({ item, labelKey, index })}
              <div className="flex">
                <div className="ml-auto flex gap-2">
                  <TempDeleteButton form={form} items={items} item={item} />
                  <DeleteButton form={form} items={items} item={item} />
                </div>
              </div>
            </div>
          )}
        </ListArea>
      </GroupArea>
    </div>
  );
}

export type MechanismProps = {
  item: any;
  index: number;
  labelKey: (item: any) => string;
};

export function getMatchedMechanism({
  item,
  index,
  ...rest
}: MechanismProps): React.ReactNode {
  const key: string = item?.["=="] ?? item?.["id"];
  if (isFormDeletableValue(item)) {
    return <div>Deleted</div>;
  }
  switch (key) {
    case "BASE_ATTACK":
      return <BaseAttack item={item} labelKey={rest.labelKey} index={index} />;
    default:
      return <div>Unknown Mechanism</div>;
  }
}

export function TempDeleteButton({
  form,
  items,
  item,
  node,
}: {
  form: ReturnType<typeof useForm> | undefined;
  items: any[];
  item: any;
  node?: string;
}) {
  return (
    <Button
      size="sm"
      onClick={() => {
        const index = items.findIndex((i) => i === item);

        form?.setValue(
          node ? `${node}.${index}` : `mechanism.${index}`,
          isFormDeletableValue(item)
            ? getFormValue(item)
            : setFormDeleteValue(getFormValue(item), true, true),
        );
      }}
    >
      Temp Delete
    </Button>
  );
}

export function DeleteButton({
  form,
  items,
  item,
  node,
}: {
  form: ReturnType<typeof useForm> | undefined;
  items: any[];
  item: any;
  node?: string;
}) {
  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => {
        form?.setValue(
          node ?? "mechanism",
          items.filter((i) => i !== item),
        );
      }}
    >
      Delete
    </Button>
  );
}
