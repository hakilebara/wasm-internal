import { Viewer } from "./Viewer";
import { readULEB128 } from "./utils";
import * as React from "react";
import { SidePanel } from "./SidePanel";

const DEMO_WASM_FILE_PATH = "addint.wasm";

const WASM_VERSION = 0x01000000;
const WASM_MAGIC_NUMBER = 0x0061736d;
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

function assertValidSectionId(id: number): asserts id is WasmSectionId {
  if (!(id in WASM_SECTIONS)) throw new Error(`INVALID SECTION ID: ${id}`);
}

export interface WasmSection {
    id:WasmSectionId;
    size:number;
    offset:number;
    payload:Uint8Array;
}

export default function App() {
  const [sectionList, setSectionList] = React.useState<WasmSection[]>();
  const [selectedSectionId, setSelectedSectionId] = React.useState<WasmSectionId>();
  const selectedSection:WasmSection|undefined = sectionList?.find(s => s.id === selectedSectionId);

  React.useEffect(() => {
    const handleFetch = async () => {
      const response = await fetch(DEMO_WASM_FILE_PATH);
      const buffer = await response.arrayBuffer();
      const buffer_length = buffer.byteLength;

      const view = new DataView(buffer);
      const magicNumber = view.getUint32(0, false);
      const versionNumber = view.getUint32(4, false);

      if (magicNumber !== WASM_MAGIC_NUMBER) {
        throw new Error("Not a valid WASM file.");
      }

      if (versionNumber !== WASM_VERSION) {
        throw new Error("Invalid WASM version.");
      }

      let sections:WasmSection[] = [];

      sections.push({id:999, size:8, offset:0, payload: new Uint8Array(buffer, 0, 8)});

      let offset = 8;
      while (true) {
        if (offset >= buffer_length) break;

        const id = view.getUint8(offset);
        assertValidSectionId(id);
        const start_offset = offset;
        ++offset;
        const { value:payload_size, offset:newOffset } = readULEB128(view, offset);
        const header_size = newOffset - start_offset;
        offset = newOffset + payload_size;
        const size = payload_size + header_size;
        sections.push({
          id,
          size,
          offset:start_offset,
          payload: new Uint8Array(buffer, start_offset, size),
        });
      }
      setSectionList(sections);
    }
    handleFetch();
  }, []);

  const handleSelectSection = (id:WasmSectionId) => {
    setSelectedSectionId(id);
  }

  return (
      <div className="h-screen flex bg-gray-100">
        <Viewer sectionList={sectionList} selectSection={handleSelectSection}/>
        <div className="flex-1 bg-white border-l-2 p-4 text-sm">
          <div className="max-w-[350px] flex flex-col gap-4">
            <SidePanel section={selectedSection}/>
          </div>
        </div>
      </div>
  )
}