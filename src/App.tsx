import { Viewer } from "./Viewer";
import { readULEB128 } from "./utils";
import * as React from "react";
import { SidePanel } from "./SidePanel";
import type { WasmSection, WasmSectionId } from "./types";
import { WASM_SECTIONS } from "./types";

const DEMO_WASM_FILE_PATH = "addint.wasm";
const WASM_VERSION = 0x01000000;
const WASM_MAGIC_NUMBER = 0x0061736d;
const MIN_PANEL_WIDTH = 200;
const MAX_PANEL_WIDTH = 600;

function assertValidSectionId(id: number): asserts id is WasmSectionId {
  if (!(id in WASM_SECTIONS)) throw new Error(`INVALID SECTION ID: ${id}`);
}

export default function App() {
  const [sectionList, setSectionList] = React.useState<WasmSection[]>();
  const [selectedSectionId, setSelectedSectionId] = React.useState<WasmSectionId>();
  const selectedSection:WasmSection|undefined = sectionList?.find(s => s.id === selectedSectionId);

  const [panelWidth, setPanelWidth] = React.useState(350);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartX = React.useRef(0);
  const dragStartWidth = React.useRef(0);

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartWidth.current = panelWidth;
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = dragStartX.current - e.clientX;
      const newWidth = Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, dragStartWidth.current + delta));
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

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
        const bytes = new Uint8Array(view.buffer);
        const { value:payload_size, offset:newOffset } = readULEB128(bytes, offset);
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
      <div className={`h-screen flex bg-gray-100 ${isDragging ? 'select-none' : ''}`}>
        <Viewer sectionList={sectionList} selectSection={handleSelectSection}/>
        <div
          className="w-[5px] cursor-col-resize bg-gray-300 hover:bg-blue-400 shrink-0"
          onMouseDown={handleDragStart}
        />
        <div className="bg-white p-4 text-sm shrink-0 overflow-auto" style={{ width: panelWidth }}>
          <div className="flex flex-col gap-4">
            <SidePanel section={selectedSection}/>
          </div>
        </div>
      </div>
  )
}