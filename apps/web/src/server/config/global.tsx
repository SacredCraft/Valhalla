import { ImageModel } from "@//components/ui/image-model";
import { Template } from "@//server/config/types";

export const globalTemplates: Template[] = [
  { name: "Image", value: ImageModel, regex: ".*\\.(png|jpe?g|gif|svg)$" },
];
