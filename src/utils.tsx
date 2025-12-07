export function readULEB128(view:DataView<ArrayBuffer>, startOffset:number): {value:number, offset:number} {
  let value = 0;
  let shift = 0;
  let offset = startOffset;
  while (true) {
    const byte = view.getUint8(offset);
    const data = byte & 0x7F;
    offset++;
    value |= data << shift;

    if ((byte & 0x80) === 0) {
      break;
    }

    shift += 7;
  }

  return { value, offset }
}