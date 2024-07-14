import { Template } from "@//server/config/types";
import { ImageModel } from "@/app/_components/ui/image-model";

export const globalTemplates: Template[] = [
  { name: "Image", value: ImageModel, regex: ".*\\.(png|jpe?g|gif|svg)$" },
];
