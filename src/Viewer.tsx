import { Section } from "./Section";
import { WASM_SECTIONS } from "./App";
import type { WasmSection } from "./App";

const VIEWER_WIDTH = 704;
const BYTES_PER_ROW = 16;
const BYTE_WIDTH = VIEWER_WIDTH/BYTES_PER_ROW;

export function Viewer({sectionList, selectSection}:{ sectionList:WasmSection[]|undefined, selectSection:Function }) {
  return (
    <div className="w-[850px] p-2 overflow-auto">
        <div className="p-2 m-2 border-2 rounded bg-white inline-block">
            <ul style={{
                height: "704px",
                width: VIEWER_WIDTH}}
                className="relative
                            bg-[radial-gradient(#aaa_1px,transparent_1px)]
                            bg-size-[22px_22px]">
                {sectionList?.map((s, index) => {
                    return (
                        <Section
                            key={index}
                            selectSection={selectSection}
                            byte_width={BYTE_WIDTH}
                            size={s.size}
                            offset={s.offset}
                            id={s.id}
                            name={WASM_SECTIONS[s.id].name}
                            color={WASM_SECTIONS[s.id].color} />
                    );
                })}
            </ul>
        </div>
    </div>
  );
}