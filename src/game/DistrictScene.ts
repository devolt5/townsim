// Re-export everything from the DistrictScene module folder.
// This file exists so that "@/game/DistrictScene" continues to resolve here
// (TypeScript prefers .ts over directory/index.ts).
export * from "./DistrictScene/index";
export * from "./DistrictScene/types";
export * from "./DistrictScene/constants";
export * from "./DistrictScene/mapData";
export * from "./DistrictScene/coordHelpers";
