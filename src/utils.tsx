export function readULEB128(bytes:Uint8Array<ArrayBuffer|ArrayBufferLike>, startOffset:number): {value:number, offset:number} {
  let value = 0;
  let shift = 0;
  let offset = startOffset;
  while (true) {
    const byte = bytes[offset];
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

export class Reader {
  #data:Uint8Array;
  offset:number = 0;

  constructor(buffer:Uint8Array) {
    this.#data = new Uint8Array(buffer);
  }

  toss(n:number):void {
    if (this.offset + n > this.#data.byteLength) throw new Error("max buffer size exceeded"); 
    this.offset += n;
  }

  takeU8():number {
    const byte = this.#data[this.offset];
    this.offset++;
    return byte;
  }

  takeULEB128():number {
    let result = 0;
    let shift = 0;
    while (true) {
      const byte = this.takeU8();
      result |= (byte & 0x7F) << shift;

      if ((byte & 0x80) === 0) break;

      shift += 7;
    }
    return result;
  }
}