import github from "./assets/github.svg";

export function IntroPanel() {
  return (
    <>
      <h1 className="text-lg font-bold mb-4">WebAssembly binary format explorer</h1>

      <p className="mb-8">
        This tools helps you explore the internal binary representation
        of a WebAssembly module. It is made for developpers who want to understand the format better.
        I suggest using as a support tool while reading the <a className="text-blue-600 underline" target="_blank" href="https://webassembly.github.io/spec/core/binary/modules.html">reference spec</a>.
      </p>

      <a className="mb-1 grid grid-cols-[auto_1fr] grid-rows-[auto_auto] cursor-pointer gap-x-3 max-w-60" target="_blank" href="https://github.com/hakilebara/wasm-internal">
        <img className="row-span-2 w-12 rounded-4xl" src={github} />
        <span className="text-sm font-semibold">wasm-internal</span>
        <span className=" text-sm text-gray-500">View source on GitHub</span>
      </a>

      <a className="grid grid-cols-[auto_1fr] grid-rows-[auto_auto] cursor-pointer gap-x-3 max-w-60" target="_blank" href="https://hakilebara.com">
        <img className="row-span-2 w-12 rounded-4xl" src="profile_photo.jpg" />
        <span className=" text-sm">hakilebara</span>
        <span className=" text-sm text-gray-500">hakilebara.com</span>
      </a>
    </>
  );
}