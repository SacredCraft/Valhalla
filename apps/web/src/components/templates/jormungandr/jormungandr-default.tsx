"use client";

import { Airplay, Annoyed, AppWindow } from "lucide-react";
import React from "react";

import { useFilesEditorContext } from "@//app/(main)/plugins/[plugin]/files/editor/[...path]/layout.client";
import { ActionsArea } from "@//components/templates-components/areas/actions-area";
import {
  TreeLikeArea,
  TreeLikeAreaAside,
  TreeLikeAreaAsideFooter,
  TreeLikeAreaAsideHeader,
  TreeLikeAreaBackButton,
  TreeLikeAreaContent,
  TreeLikeAreaContentBreadcrumb,
  TreeLikeAreaContentHeader,
  TreeLikeAreaCreateSheet,
  TreeLikeAreaNodes,
  TreeLikePath,
} from "@//components/templates-components/areas/tree-like-area";
import { ButtonGroup } from "@//components/templates-components/form/button-group";
import { Enum } from "@//components/templates-components/form/enum";
import { Node, useNode } from "@//components/templates-components/form/node";
import { Text } from "@//components/templates-components/form/text";
import {
  Categories,
  CategoriesRoot,
  Category,
  CategoryContent,
} from "@//components/templates-components/misc/categories";
import { BaseAttack } from "@//components/templates/jormungandr/mechanism/base-attack";
import { Hostile } from "@//components/templates/jormungandr/mechanism/hostile";
import { Button } from "@//components/ui/button";
import { Label } from "@//components/ui/label";
import { isFormDeletableValue } from "@/lib/form";

export function JormungandrDefault() {
  return (
    <CategoriesRoot>
      <Categories>
        <Category category="basic" isDefault>
          Basic Configuration
        </Category>
        <Category category="default">Default</Category>
        <Category category="mechanism">Mechanism</Category>
      </Categories>
      <CategoryContent
        category="basic"
        title="Basic Configuration"
        description="Edit the basic configuration of the item."
        icon={<Airplay className="size-8" />}
      >
        <Node node="type">
          <Text
            label="Type"
            description="Edit the type of the item."
            defaultValue="HUSK"
          />
        </Node>
      </CategoryContent>
      <CategoryContent
        category="default"
        title="Default"
        description="Edit the default configuration of the item."
        icon={<Annoyed className="size-8" />}
        className="grid grid-cols-2 gap-4"
      >
        <Node node="default">
          <div className="space-y-2">
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-base">Misc Options</Label>
                <p className="text-sm text-muted-foreground">
                  Edit the misc options of the item.
                </p>
              </div>
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
            </div>
          </div>

          <div className="space-y-2">
            <div className="space-y-1">
              <Label className="text-base">Model Options</Label>
              <p className="text-sm text-muted-foreground">
                Edit the model options of the item.
              </p>
            </div>
            <Node
              node="model-options"
              nodes={["model-options.nametag", "model-options.state-machine"]}
            >
              <ActionsArea className="flex md:flex-row flex-col md:items-center items-start md:space-x-4 md:space-y-0 space-y-4">
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
        </Node>
      </CategoryContent>

      <CategoryContent
        category="mechanism"
        title="Mechanism"
        description="Edit the mechanism of the item."
        icon={<AppWindow className="size-8" />}
      >
        <Node node="mechanism">
          <TreeLikeArea
            depth={2}
            labelKeys={["==", "id"]}
            treeKeys={[
              {
                label: "Processor",
                value: "processor.mech",
              },
              {
                label: "Prepare",
                value: "prepare.mech",
              },
              {
                label: "Trigger",
                value: "trigger.mech",
              },
            ]}
          >
            <TreeLikeAreaContent>
              {(path) => (
                <>
                  <TreeLikeAreaContentHeader>
                    <TreeLikeAreaContentBreadcrumb />
                  </TreeLikeAreaContentHeader>
                  <MatchedMechanism path={path} />
                </>
              )}
            </TreeLikeAreaContent>
            <TreeLikeAreaAside>
              <TreeLikeAreaAsideHeader>
                <TreeLikeAreaBackButton
                  variant="secondary"
                  className="w-full"
                  size="sm"
                >
                  Back
                </TreeLikeAreaBackButton>
              </TreeLikeAreaAsideHeader>
              <TreeLikeAreaNodes />
              <TreeLikeAreaAsideFooter>
                <TreeLikeAreaCreateSheet />
              </TreeLikeAreaAsideFooter>
            </TreeLikeAreaAside>
          </TreeLikeArea>
        </Node>
      </CategoryContent>
    </CategoriesRoot>
  );
}

export const MatchedMechanism = ({ path }: { path: TreeLikePath[] }) => {
  const { node } = useNode();
  const { form } = useFilesEditorContext();
  if (!node) {
    return null;
  }
  const mechanism = form.watch(node);

  if (path.length === 0) {
    return (
      <div className="h-36 flex justify-center items-center text-muted-foreground">
        Select a mechanism to edit its properties.
      </div>
    );
  }

  return getMatchedMechanism({ item: mechanism });
};

export function getMatchedMechanism({ item }: { item: any }): React.ReactNode {
  const key: string = item?.["=="] ?? item?.["id"];
  if (isFormDeletableValue(item)) {
    return <div>Deleted</div>;
  }
  switch (key) {
    case "BASE_ATTACK":
      return <BaseAttack />;
    case "HOSTILE":
      return <Hostile />;
    default:
      return (
        <div className="h-36 flex justify-center items-center text-muted-foreground">
          No mechanism matched.
        </div>
      );
  }
}
