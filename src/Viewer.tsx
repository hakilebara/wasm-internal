import * as React from "react";
import { readULEB128 } from "./utils";
import { Section } from "./Section";

export const VIEWER_WIDTH = 704;
export const BYTES_PER_ROW = 16;
export const BYTE_WIDTH = VIEWER_WIDTH/BYTES_PER_ROW;

const DEMO_WASM_FILE_PATH = "addint.wasm";

const WASM_VERSION = 0x01000000;
const WASM_MAGIC_NUMBER = 0x0061736d;
const WASM_SECTIONS = {
  999:"PREAMBLE",
  0:"CUSTOM",
  1:"TYPE",
  2:"IMPORT",
  3:"FUNCTION",
  4:"TABLE",
  5:"MEMORY",
  6:"GLOBAL",
  7:"EXPORT",
  8:"START",
  9:"ELEMENT",
  10:"CODE",
  11:"DATA",
  12:"DATACOUNT",
  13:"TAG",
} as const;
type WasmSectionId = keyof typeof WASM_SECTIONS;

function assertValidSectionId(id: number): asserts id is WasmSectionId {
  if (!(id in WASM_SECTIONS)) throw new Error(`INVALID SECTION ID: ${id}`);
}

export function Viewer() {
  const [state, setState] = React.useState<{id:WasmSectionId,size:number,offset:number}[]>([{id:0, size:0, offset:0}]);
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

      let sections:{id:WasmSectionId,size:number,offset:number}[] = [];

      sections.push({id:999, size:8, offset:0}); // preamble

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
        sections.push({ id, size:payload_size+header_size, offset:start_offset});
      }
      setState(sections);
    }
    handleFetch(); 
  }, []);

  return (
    <div className="h-screen bg-gray-100">
      <div className="p-2 m-2 inline-block bg-white rounded border-2">
        <ul style={{
          height: "704px",
          width: VIEWER_WIDTH,
        }} className="relative bg-white
                      bg-[radial-gradient(#aaa_1px,transparent_1px)]
                      [background-size:22px_22px]">
          {state.map((s, index) => {
            return (
              <Section
                  key={index}
                  byte_width={BYTE_WIDTH} 
                  size={s.size}
                  offset={s.offset}
                  name={WASM_SECTIONS[s.id]} />
            );
          })}
        </ul>
      </div>
    </div>
  );
}