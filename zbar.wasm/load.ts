const __dirname = new URL('.', import.meta.url).pathname

export const loadWasmInstance = async (
	importObj: any,
): Promise<WebAssembly.Instance | null> => {
	const wasmCode = await Deno.readFile(`${__dirname}/zbar.wasm`)
	const wasmModule = new WebAssembly.Module(wasmCode)
	const wasmInstance = new WebAssembly.Instance(wasmModule, importObj)

	return wasmInstance
}
