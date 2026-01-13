export const WASM_SECTIONS = {
  999: { name: "PREAMBLE", color: "#9cff94" },
  0:   { name: "CUSTOM",   color: "#a6cee3" },
  1:   { name: "TYPE",     color: "#93d3ff" },
  2:   { name: "IMPORT",   color: "#b2df8a" },
  3:   { name: "FUNCTION", color: "#33a02c" },
  4:   { name: "TABLE",    color: "#fb9a99" },
  5:   { name: "MEMORY",   color: "#e31a1c" },
  6:   { name: "GLOBAL",   color: "#fdbf6f" },
  7:   { name: "EXPORT",   color: "#ff7f00" },
  8:   { name: "START",    color: "#cab2d6" },
  9:   { name: "ELEMENT",  color: "#6a3d9a" },
  10:  { name: "CODE",     color: "#ffff99" },
  11:  { name: "DATA",     color: "#b15928" },
  12:  { name: "DATACOUNT",color: "#4dc9b0" },
  13:  { name: "TAG",      color: "#d081ef" },
} as const;

export type WasmSectionId = keyof typeof WASM_SECTIONS;

export interface WasmSection {
    id:WasmSectionId;
    size:number;
    offset:number;
    payload:Uint8Array<ArrayBuffer>;
}