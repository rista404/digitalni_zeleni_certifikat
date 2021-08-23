import { Image } from './Image.ts'
import { ImageScanner } from './ImageScanner.ts'
import { Symbol } from './Symbol.ts'

/** The underlying pixel data of an area of a <canvas> element. It is created using the ImageData() constructor or creator methods on the CanvasRenderingContext2D object associated with a canvas: createImageData() and getImageData(). It can also be used to set a part of the canvas by using putImageData(). */
export interface ImageData {
	/**
	 * Returns the one-dimensional array containing the data in RGBA order, as integers in the range 0 to 255.
	 */
	readonly data: Uint8ClampedArray
	/**
	 * Returns the actual dimensions of the data in the ImageData object, in pixels.
	 */
	readonly height: number
	/**
	 * Returns the actual dimensions of the data in the ImageData object, in pixels.
	 */
	readonly width: number
}

const defaultScannerPromise = ImageScanner.create()
export const getDefaultScanner = async () => {
	return await defaultScannerPromise
}

const scanImage = async (
	image: Image,
	scanner?: ImageScanner,
): Promise<Array<Symbol>> => {
	if (scanner === undefined) {
		scanner = await defaultScannerPromise
	}
	const res = scanner.scan(image)
	if (res < 0) {
		throw Error('Scan Failed')
	}
	if (res === 0) return []
	return image.getSymbols()
}

export const scanGrayBuffer = async (
	buffer: ArrayBuffer,
	width: number,
	height: number,
	scanner?: ImageScanner,
): Promise<Array<Symbol>> => {
	const image = await Image.createFromGrayBuffer(width, height, buffer)
	const res = await scanImage(image, scanner)
	image.destroy()
	return res
}

export const scanRGBABuffer = async (
	buffer: ArrayBuffer,
	width: number,
	height: number,
	scanner?: ImageScanner,
): Promise<Array<Symbol>> => {
	const image = await Image.createFromRGBABuffer(width, height, buffer)
	const res = await scanImage(image, scanner)
	image.destroy()
	return res
}

export const scanImageData = async (
	image: ImageData,
	scanner?: ImageScanner,
): Promise<Array<Symbol>> => {
	return await scanRGBABuffer(
		image.data.buffer,
		image.width,
		image.height,
		scanner,
	)
}
