import * as React from "react";
import type { WasmSection } from "./types";
import { Reader } from "./utils";

const VALTYPE = {
    i32: 0x7F,
    i64: 0x7E,
    f32: 0x7D,
    f64: 0x7C,
    v128: 0x7B,
    funcref: 0x70,
    externref: 0x6F,
} as const;

const VALTYPE_NAME: Record<Valtype, string> = Object.fromEntries(
  Object.entries(VALTYPE).map(([key, val]) => [val, key])
) as Record<Valtype, string>;

type Valtype = typeof VALTYPE[keyof typeof VALTYPE]

type FuncType = {
  params: Valtype[],
  results: Valtype[],
}

function TypeSectionDetail({ section }: {section: WasmSection}) {
  const functypes:FuncType[] = [];

  const reader = new Reader(section.payload)
  const section_id = reader.takeU8();
  const section_size = reader.takeULEB128();
  const functype_list_size = reader.takeULEB128();
  for (let i = 0; i < functype_list_size; ++i) {
    const functype_0x60 = reader.takeU8()
    if (functype_0x60 != 0x60) throw new Error("Invalid Type Section FuncType")

    const params:Valtype[] = [];
    const results:Valtype[] = [];
    const params_resulttype_size = reader.takeULEB128();
    for (let j = 0; j < params_resulttype_size; ++j) {
      params.push(reader.takeU8() as Valtype);
    }

    const result_resulttype_size = reader.takeULEB128();
    for (let j = 0; j < result_resulttype_size; ++j) {
      results.push(reader.takeU8() as Valtype);
    }

    functypes.push({ params, results });
  }
  
  return (
    <details>
      <summary>Header</summary>
      <div className="ml-4">
        <span>Id: {section_id}</span> 
        <br />
        <span>Size: {section_size}</span> 
      </div>

      <details className="ml-4">
        <summary>List ({functype_list_size})</summary>
          {functypes.map((ft, ft_idx) => {
            return (
              <details className="ml-4" key={ft_idx}>
                <summary>FuncType</summary>

                <details className="ml-4">
                  <summary>Params</summary>
                  <details className="ml-4">
                    <summary>List ({ft.params.length})</summary>
                      {ft.params.map((param, param_idx) => {
                        return(
                          <p className="ml-4" key={param_idx}>
                            {VALTYPE_NAME[param]}
                          </p>
                        );
                      })}
                  </details>
                </details>
                
                <details className="ml-4">
                  <summary>Return Type</summary>
                  <details className="ml-4">
                    <summary>List ({ft.results.length})</summary>

                      {ft.results.map((result, result_idx) => {
                        return(
                          <p className="ml-4" key={result_idx}>
                            {VALTYPE_NAME[result]}
                          </p>
                        );
                      })}

                  </details>
                </details>

              </details>
            )
          })}


      </details>

    </details>
  )
}
export function TypePanel ({ section }: { section:WasmSection}) {
  const [state, setState] = React.useState<"hex"|"ascii">("hex");
  const handleClick = () => {
    setState(state === "hex" ? "ascii" : "hex");
  }
  return (
    <>
      <div>
        <h1 className="text-lg font-bold">Type Section</h1>
        <span className="text-gray-500 text-sm">Offset: {section.offset} • Length: {section.size} bytes</span>
      </div>

      <p>
        All function, structure, or array types used in a module must be defined in this section.
      </p>

      <div>
        <div className="flex gap-2 mb-1">
          <button onClick={handleClick} className={`${state === "hex" ? "bg-gray-700 text-white" : "bg-gray-200"} px-2 py-0.5 rounded text-sm hover:bg-gray-300 cursor-pointer`}>Hex</button>
          <button onClick={handleClick} className={`${state === "ascii" ? "bg-gray-700 text-white" : "bg-gray-200"} px-2 py-0.5 rounded text-sm hover:bg-gray-300 cursor-pointer`}>Ascii</button>
        </div>
        {
          state === "hex"
            ?
            <pre className="font-mono bg-gray-200 p-2">
              {section.payload.reduce((acc, val) => {
                return acc+=`${val.toString(16).padStart(2, '0')} `;
              }, "")}
            </pre>
            :
            <pre className="font-mono bg-gray-200 p-2">
              {section.payload.reduce((acc, val) => {
                return acc+=`${(val >= 32 && val <= 126) ? String.fromCodePoint(val): '.'} `;
              }, "")}
            </pre>
        }
      </div>
      
      <TypeSectionDetail section={section}/>

    </>
  );
}