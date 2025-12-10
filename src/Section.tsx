import { type WasmSectionId } from "./App";

const SECTION_HEIGHT = 24;
const x_interspace = 2;

export interface SectionProps {
  byte_width: number;
  size: number;
  offset: number;
  name: string;
  color: string;
  id: WasmSectionId;
  selectSection: Function;
}

export function Section({ byte_width, size, offset, name, color, id, selectSection}: SectionProps) {
  const chunks = [];
  while (size > 0) {
    const available_width = 16 - (offset % 16);
    const chunk_size = Math.min(available_width, size);
    chunks.push({ size: chunk_size, offset });
    offset += chunk_size;
    size -= chunk_size;
  }

  const handleClick = () => {
    selectSection(id);
  }

  return (
    chunks.map(({ size, offset }, index) => {
      const row = Math.floor(offset / 16);
      const col = (offset % 16);
      const y_interspace = 2 * row;
      return (
        <li key={index}
          className={`absolute h-6 pl-1 cursor-pointer text-xs p-1 font-mono border-t border-b ${index === 0 ? "border-l" : ""} ${index === chunks.length -1 ? "border-r" : ""}`}
          onClick={handleClick}
          style={{
            width: byte_width * size - x_interspace,
            backgroundColor: color,
            left: col * byte_width,
            top: (row * SECTION_HEIGHT) + y_interspace,
        }}>
          {(() => {
            const isFirst = (index === 0);
            const suffix = (id === 999) ? "" : " Section";
            const section_name = name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase() + suffix
            return (isFirst) ? section_name : null;
          })()}
        </li>
      );
    })
  );
}