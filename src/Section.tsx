import * as React from "react";

export interface SectionProps {
  byte_width: number;
  size: number;
  offset: number;
  name: string;
}

export function Section({ byte_width, size, offset, name}: SectionProps) {
  const chunks = [];
  const color = `#${Math.floor(Math.random()*16).toString(16)}${Math.floor(Math.random()*16).toString(16)}${Math.floor(Math.random()*16).toString(16)}`;
  const [bgc, setBgc] = React.useState<string>(color);

  while (size > 0) {
    const available_width = 16 - (offset % 16);
    const chunk_size = Math.min(available_width, size);
    chunks.push({ size: chunk_size, offset });
    offset += chunk_size;
    size -= chunk_size;
  }

  return (
    chunks.map(({ size, offset }, index) => {
      return (
        <li key={index} 
          onMouseEnter={() => {setBgc("red")}}
          onMouseLeave={() => {setBgc(color)}}
          className="absolute h-6 pl-1" 
          style={{
            width: byte_width * size,
            backgroundColor: bgc,
            left: (offset % 16)*byte_width,
            top: Math.floor(offset/16) * 24,
        }}>
          {index === 0 ? name.toLocaleLowerCase() : null}
        </li>
      );
    })
  );
}