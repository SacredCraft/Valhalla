import { AreaAction } from "@/components/form/area-actions";
import { Block } from "@/components/form/block";
import { ButtonGroup } from "@/components/form/button-group";
import { Enum } from "@/components/form/enum";
import { Text } from "@/components/form/text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ZaphkielItem() {
  return (
    <div className="space-y-4">
      <Block
        title="Basic Configuration"
        description="Configure the basic information of the item."
      >
        <Text
          name="type"
          label="Type"
          description="Edit the type of the item."
          defaultValue="HUSK"
        />
      </Block>
      <Block
        title="Default"
        description="Configure the default settings."
        defaultCollapsed={false}
      >
        <div className="flex md:flex-row flex-col w-full md:items-center items-start md:space-x-4 md:space-y-0 space-y-4">
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

        <Accordion type="single" collapsible defaultValue="model">
          <AccordionItem value="model" className="border-0">
            <AccordionTrigger className="text-lg">
              Model Configuration
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-0" asChild>
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
                <AreaAction
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
                </AreaAction>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Block>
    </div>
  );
}
