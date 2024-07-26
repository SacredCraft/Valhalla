import { User } from "@sacred-craft/valhalla-database";

export type Version = {
  path: string[];
  name: string;
  version: string;
  comment?: string;
  operators: string[] | User[];
  timestamp: string;
};
