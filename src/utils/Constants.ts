export const USER = "user";
export const CANVAS_ID = "main-canvas";
export const RADIAN_TO_DEGREE_MULTIPLIER = 180 / 3.14159265359;

export enum ElementType {
  LINKAGE = "L",
  CONNECTION = "C",
  POINT = "P",
  FORCE = "F",
  NONE = "",
}

export enum ConnectionType {
  PIN = "PIN",
  FIXED = "FIXED",
  FREE = "FREE",
  HORIZONTAL_ROLLER = "HORIZONTAL_ROLLER",
}
