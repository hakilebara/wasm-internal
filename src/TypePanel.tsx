import * as React from "react";
import type { WasmSection } from "./types";

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
      <table className="text-sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Descrition</th>
            <th>Bytes</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{section.offset}</td>
            <td>Magic Number</td>
            <td>4</td>
            <td>
              {section.payload.slice(0,4).reduce((acc, val) => {
                return acc+=`${val.toString(16).padStart(2, '0')} `;
              }, "")}
            </td>
          </tr>
          <tr>
            <td>{section.offset + 4}</td>
            <td>Version</td>
            <td>4</td>
            <td>
              {section.payload.slice(4).reduce((acc, val) => {
                return acc+=`${val.toString(16).padStart(2, '0')} `;
              }, "")}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}