import type { WasmSection } from "./types";


export function ExportPanel({ section }: { section: WasmSection; }) {
  return (
    <div>
      <h1 className="text-lg font-bold">Export Section</h1>
      <span className="text-gray-500 text-sm">Offset: {section.offset} • Length: {section.size} bytes</span>
    </div>
  );
}
