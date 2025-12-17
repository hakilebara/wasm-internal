import { Viewer } from "./Viewer";
import { readULEB128 } from "./utils";
import * as React from "react";
import { SidePanel } from "./SidePanel";
import type { WasmSection, WasmSectionId } from "./types";
import { WASM_SECTIONS } from "./types";

const DEMO_WASM_FILE_PATH = "addint.wasm";
const WASM_VERSION = 0x01000000;
const WASM_MAGIC_NUMBER = 0x0061736d;

function assertValidSectionId(id: number): asserts id is WasmSectionId {
  if (!(id in WASM_SECTIONS)) throw new Error(`INVALID SECTION ID: ${id}`);
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