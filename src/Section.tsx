import { type WasmSectionId } from "./App";

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
      return (
        <li key={index}
          className="absolute h-6 pl-1 cursor-pointer"
          onClick={handleClick}
          style={{
            width: byte_width * size,
            backgroundColor: color,
            left: (offset % 16)*byte_width,
            top: Math.floor(offset/16) * 24,
        }}>
          {index === 0 ? name.toLocaleLowerCase() : null}
        </li>
      );
    })
  );
}