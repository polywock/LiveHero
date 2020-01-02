
const chromatic = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function freqToLinear(freq: number) {
  return Math.log2(freq / 440)
}

export function idxFromFreq(freq: number, segments: number) {
	var noteNum = segments * Math.log2(freq / 440);
	return (Math.round(noteNum) + 69) % segments
}

export function fluidFromFreq(freq: number, segments: number) {
	var noteNum = segments * Math.log2(freq / 440);
	return (noteNum + 69) % segments
}

export function linearToChromatic(linear: number): string {
  return chromatic[(Math.round(linear * 12) + (12 * 1000)) % 12]  
}

export function getNormal(lb: number, rb: number, value: number) {
	const delta = rb - lb
	return (value - lb) / delta
}

export function getMaxAmp(td: Float32Array): number {
	return td.reduce((agg, v) => {
		const V = Math.abs(v)
		return V > agg ? V : agg
	}, -Infinity)
}

export function generateUUID() {
	return Array(16).fill(0).map(v => {
		const num = Math.floor(Math.random() * 37)
		if (num < 10) {
			return num.toString()
		} else {
			return String.fromCharCode(num - 10 +  97)
		}
	}).join("")
}

export function clamp(min: number, max: number, value: number): number {
	return Math.max(Math.min(max, value), min)
}

export function round(value: number, precision: number): number {
	const scalar = 10 ** precision
	return Math.round(value * scalar) / scalar
}

export function cloneObject<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj))
}

export function between(lb: number, rb: number, value: number) {
	if(isNaN(1 + lb + rb + value)) {
		return false
	}
	if (value < lb || value > rb) {
		return false 
	}
	return true 
}

export function isNullOrUndefined(value: any) {
	if (value === null || value === undefined) {
		return true 
	} 
	return false
}

type RGB = {
	r: number,
	g: number,
	b: number
}

type RGBA = {
	r: number,
	g: number,
	b: number,
	a: number 
}

export function numToHex(num: number) {
	var s = Math.round(num).toString(16)
	if (s.length === 1) {
		s = "0".concat(s)
	}
	return s.slice(0, 2)
}

export function parseHex(color: string): RGB {
	const match = (/#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i).exec(color)
	if (match) {
		const r = parseInt(match[1], 16)
		const g = parseInt(match[2], 16)
		const b = parseInt(match[3], 16)
		return {r, g, b}
	}
	return null
}

export function invertRGB(color: RGB): RGB {
	return {
		r: 255 - color.r,
		g: 255 - color.g,
		b: 255 - color.b
	}
}


export function rgbToHex(color: RGB): string {
	return `#${
		numToHex(color.r)
	}${
		numToHex(color.g)
	}${
		numToHex(color.b)
	}`
}

export function rgbaToHex(color: RGBA): string {
	return `#${
		numToHex(color.r)
	}${
		numToHex(color.g)
	}${
		numToHex(color.b)
	}${
		numToHex(clamp(0, 255, Math.round(color.a * 255)))
	}`
}

export function invertHex(color: string) {
	return rgbToHex(invertRGB(parseHex(color)))
}

export function isFirefox() {
	return /Firefox\/([0-9\.]+)(?:\s|$)/.test(navigator.userAgent)
}