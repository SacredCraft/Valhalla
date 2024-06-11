"use client";

import { useContext } from "react";

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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ZaphkielItem() {
  const { form } = useContext(EditorContext);

  return (
    <div className="space-y-4">
      <GroupArea
        title="Basic Configuration"
        description="Configure the basic information of the item."
      >
        <Text
          name="type"
          label="Type"
          description="Edit the type of the item."
          defaultValue="HUSK"
        />
      </GroupArea>
      <GroupArea title="Default" description="Configure the default settings.">
        <div className="flex md:flex-row flex-col w-full md:items-center items-start md:space-x-4 md:space-y-2 space-y-4">
          <Text
            name="default.display-name"
            label="Display Name"
            description="Edit the display name of the item."
            defaultValue="我是傻逼"
          />
          <ButtonGroup
            name="default.display-name-visible"
            label="Display Name Visibility"
            description="Edit the display name visibility of the item."
            defaultValue={true}
          >
            <Button value="true">True</Button>
            <Button value="false">False</Button>
          </ButtonGroup>
        </div>
        <Text
          name="default.health"
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
            name="default.model"
            label="Model"
            items={[
              { value: "zenda_bugs", label: "Zenda Bugs" },
              { value: "azura_bugs", label: "Azura Bugs" },
            ]}
            description="Edit the model of the item."
          />

          <div className="space-y-2 overflow-visible">
            <Label className="text-base">Model Options</Label>
            <ActionsArea
              className="flex md:flex-row flex-col md:items-center items-start md:space-x-4 md:space-y-0 space-y-4 rounded-lg border p-3"
              nodes={[
                "default.model-options.nametag",
                "default.model-options.state-machine",
              ]}
            >
              <Text
                name="default.model-options.nametag"
                label="Nametag"
                description="Edit the nametag of the item."
                defaultValue="yournametag"
              />
              <ButtonGroup
                name="default.model-options.state-machine"
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
          deletable
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
          {({ item, items, deletable }) => (
            <>
              {deletable && (
                <div className="flex">
                  <div className="ml-auto flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const value = items.map((i, index) =>
                          i === item
                            ? isFormDeletableValue(item)
                              ? getFormValue(item)
                              : setFormDeleteValue(
                                  getFormValue(item),
                                  true,
                                  true,
                                  index,
                                )
                            : i,
                        );
                        form?.setValue("mechanism", value);
                      }}
                    >
                      Temp Delete
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        form?.setValue(
                          "mechanism",
                          items.filter((i) => i !== item),
                        );
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </ListArea>
      </GroupArea>
    </div>
  );
}
