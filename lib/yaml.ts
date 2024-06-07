import { Document, parseDocument, stringify } from "yaml";

export function fromString(yamlString: string): Document {
  return parseDocument(yamlString);
}

export function fromJson(json: any): Document {
  return fromString(stringify(json));
}
