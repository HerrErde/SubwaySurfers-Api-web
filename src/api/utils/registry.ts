import type { ApiKind } from "../types";

const kindMap: Record<string, ApiKind> = {
  ss: "SS",
  ssc: "SSC"
};

// Use Vite's glob to import all generated _pb modules eagerly.
// Pattern is relative to this file.
const modules = (import.meta as any).glob("../../gen/**/*_pb.ts", {
  eager: true
}) as Record<string, any>;

const registry: Record<ApiKind, Record<string, any>> = {
  SS: {},
  SSC: {}
};

for (const filePath in modules) {
  const mod = modules[filePath];
  const normalized = filePath.replace(/\\/g, "/");
  const match = /\/gen\/([^/]+)\//.exec(normalized);
  const folder = match ? match[1] : null;
  const kind = folder ? kindMap[folder] : undefined;
  if (!kind) continue;

  Object.keys(mod).forEach((exportName) => {
    registry[kind][exportName] = mod[exportName];
  });
}

interface ProtobufMessage {
  fromBinary(bytes: Uint8Array): ProtobufMessage;
  toJson(): unknown;
  new (data?: Partial<unknown>): ProtobufMessage;
}

export function resolveProtoType(kind: ApiKind, typeName: string): ProtobufMessage {
  if (!typeName) {
    throw new Error(`typeName is required for resolveProtoType in ${kind}`);
  }

  // If typeName is "player.ext.v1.UpdatePlayerRequest",
  // we look for "UpdatePlayerRequest" in the registry for that kind.
  const parts = typeName.split(".");
  const className = parts[parts.length - 1];

  const kindRegistry = registry[kind];
  if (!kindRegistry) {
    throw new Error(`Registry not found for kind: ${kind}`);
  }

  const type = kindRegistry[className];
  if (!type) {
    console.error(`Registry for ${kind}:`, Object.keys(kindRegistry));
    throw new Error(
      `Proto type ${typeName} (class ${className}) not found in ${kind} registry`
    );
  }
  return type;
}
