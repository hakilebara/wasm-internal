import type { WasmSection } from "./types";
import { TypePanel } from "./TypePanel";
import { IntroPanel } from "./IntroPanel";
import { PreamblePanel } from "./PreamblePanel";
import { FunctionPanel } from "./FunctionPanel";
import { ExportPanel } from "./ExportPanel";
import { CodePanel } from "./CodePanel";

export const SidePanel = ({ section }:{ section: WasmSection|undefined}) => {
    if (section?.id === 999) return <PreamblePanel section={section}/>
    if (section?.id === 1) return <TypePanel section={section}/>
    if (section?.id === 3) return <FunctionPanel section={section}/>
    if (section?.id === 7) return <ExportPanel section={section}/>
    if (section?.id === 10) return <CodePanel section={section}/>
    return <IntroPanel />
}