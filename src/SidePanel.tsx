import * as React from "react";
import type { WasmSection } from "./App";

const IntroPanel = () => {
  return (
    <>
      <h1 className="text-lg mb-4">WebAssembly binary format explorer</h1>
      <p className="mb-4">
        This tools helps you explore the internal binary representation
        of a WebAssembly module.
      </p>

      <img className="w-12 rounded-4xl" src="profile_photo.jpg" />
    </>
  );
}
const PreamblePanel = ({ section }: { section:WasmSection}) => {
  const [state, setState] = React.useState<"hex"|"ascii">("hex");
  const handleClick = () => {
    setState(state === "hex" ? "ascii" : "hex");
  }
  return (
    <>
      <h1 className="text-lg font-bold">Preamble</h1>
      <span className="text-gray-500 text-sm">Offset: {section.offset} Size: {section.size}</span>
      <p>
        The encoding of a module starts with a preamble containing a 4-byte magic number (the string ‘\𝟶𝚊𝚜𝚖’)
        and a version field. The current version of the WebAssembly binary format is 1.
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
                return acc+=`${val.toString(16)} `;
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
                return acc+=`${val.toString(16)} `;
              }, "")}
            </td>
          </tr>
          <tr>
            <td>{section.offset + 4}</td>
            <td>Version</td>
            <td>4</td>
            <td>
              {section.payload.slice(4).reduce((acc, val) => {
                return acc+=`${val.toString(16)} `;
              }, "")}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
const TypePanel = ({ section }: { section:WasmSection}) => {
  return (
    <h1 className="text-lg font-bold">Type Section</h1>
  );
}
const FunctionPanel = ({ section }: { section:WasmSection}) => {
  return (
    <h1 className="text-lg font-bold">Function Section</h1>
  );
}
const ExportPanel = ({ section }: { section:WasmSection}) => {
  return (
    <h1 className="text-lg font-bold">Export Section</h1>
  );
}
const CodePanel = ({ section }: { section:WasmSection}) => {
  return (
    <h1 className="text-lg font-bold">Code Section</h1>
  );
}

export const SidePanel = ({ section }:{ section: WasmSection|undefined}) => {
    if (section?.id === 999) return <PreamblePanel section={section}/>
    if (section?.id === 1) return <TypePanel section={section}/>
    if (section?.id === 3) return <FunctionPanel section={section}/>
    if (section?.id === 7) return <ExportPanel section={section}/>
    if (section?.id === 10) return <CodePanel section={section}/>
    return <IntroPanel />
}