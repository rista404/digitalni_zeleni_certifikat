const wasmCode = await Deno.readFile('zbar.wasm')
const wasmModule = new WebAssembly.Module(wasmCode)
const wasmInstance = new WebAssembly.Instance(wasmModule, {})
console.log(wasmInstance.exports)
