import {
	createCanvas,
	loadImage,
} from 'https://deno.land/x/canvas@v1.2.2/mod.ts'
import { DOMParser, Node } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts'
import { scanImageData } from './zbar.wasm/index.ts'

const fileName = window
	.prompt('Type the name of the file (with the extension):')
	?.trim()

if (!fileName) {
	console.log('Please provide a file name')
	Deno.exit(1)
}

// fetch image
const testImg = await loadImage(`./${fileName}`)
const [w, h] = [testImg.width(), testImg.height()]

// create canvas
const canvas = createCanvas(w, h)
const ctx = canvas.getContext('2d')

// draw and extract image data
ctx.drawImage(testImg, 0, 0)
const imgData = ctx.getImageData(0, 0, w, h)

// extract codes
const codes = await scanImageData(imgData)
const [code] = codes

// check url
const url = new URL(code.decode())
if (url.hostname !== 'euprava.gov.rs') {
	throw new Error('URL invalid')
}

// fetch
const resp = await fetch(url)
const html = await resp.text()

// parse dom
const doc = new DOMParser().parseFromString(html, 'text/html')!

export function extract<T extends string>(
	el: Node,
	keys: readonly T[],
): Record<T, string> {
	return keys.reduce((acc, key, idx) => {
		acc[key] = el.children[idx].children[1].textContent
		return acc
	}, {} as Record<T, string>)
}

const [_, l1, l2, l3] = doc.querySelectorAll('.lic-list')

// in order as they appear on the website
const personalKeys = [
	'jmbg',
	'ime_latin',
	'ime',
	'prezime_latin',
	'prezime',
	'pol_latin',
	'pol',
	'pol_eng',
	'datum_rodjenja',
] as const

const doseKeys = [
	'dose',
	'tip',
	'serijski_broj',
	'datum',
	'proizvodjac',
	'mesto_vakcinacije',
	'mesto_vakcinacija_latin',
] as const

const personal = extract(l1, personalKeys)
const dose1 = extract(l2, doseKeys)
const dose2 = extract(l3, doseKeys)

console.log(personal, dose1, dose2)
