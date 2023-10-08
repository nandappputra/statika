export const USER_ID = 0;
export const CANVAS_ID = "main-canvas";
export const RADIAN_TO_DEGREE_MULTIPLIER = 180 / 3.14159265359;

export const METADATA_STRUCTURE = "structure";
export const METADATA_FACTORY = "factory";

export enum EntityPrefix {
  LINKAGE = "L",
  CONNECTION = "C",
  POINT = "P",
  FORCE = "F",
  NONE = "",
}

export enum EntityKind {
  LINKAGE = "Linkage",
  CONNECTION = "Connection",
  POINT = "Point",
  FORCE = "Force",
}

export enum ConnectionKind {
  PIN_JOINT = "Pin joint",
  PIN = "Pin",
  FIXED = "Fixed",
  HORIZONTAL_ROLLER = "Horizontal Roller",
  VERTICAL_ROLLER = "Vertical Roller",
}
