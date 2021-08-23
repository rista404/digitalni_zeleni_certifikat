import {
	createCanvas,
	loadImage,
} from 'https://deno.land/x/canvas@v1.2.2/mod.ts'
import { scanImageData } from './zbar.wasm/index.ts'

const testImg = await loadImage('./test1.png')
const [w, h] = [testImg.width(), testImg.height()]

const canvas = createCanvas(w, h)
const ctx = canvas.getContext('2d')
ctx.drawImage(testImg, 0, 0)

const imgData = ctx.getImageData(0, 0, w, h)
const codes = await scanImageData(imgData)

console.log(codes)
