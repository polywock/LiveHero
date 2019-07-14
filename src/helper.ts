
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

export function autoCorrelate(buf: Float32Array, sampleRate: number): {
	freq: number,
	power: number
} {
	var maxSamples = Math.floor(buf.length / 2);
	var bestLag = -1;
	var bestCorrelation = 0;
	var foundGoodCorrelation = false;
	var correlations = new Array(maxSamples);

	const signalStrength = Math.sqrt(buf.reduce((agg, v) => agg + v * v) / buf.length)

	if (signalStrength < 0.025) // not enough signal
		return null;

	var lastCorrelation = 1;

	for (var offset = 0; offset < maxSamples; offset++) {
		var correlation = 0;

		for (var i = 0; i < maxSamples; i++) {
			correlation += Math.abs((buf[i]) - (buf[i + offset]));
		}
		correlation = 1 - (correlation/maxSamples);
		correlations[offset] = correlation; // store it, for the tweaking we need to do below.
		if ((correlation > 0.9) && (correlation > lastCorrelation)) {
			foundGoodCorrelation = true;
			if (correlation > bestCorrelation) {
				bestCorrelation = correlation;
				bestLag = offset;
			}
		} else if (foundGoodCorrelation) {
			var shift = (correlations[bestLag + 1] - correlations[bestLag - 1]) / correlations[bestLag];  
			return {
				freq: sampleRate / (bestLag + (8 * shift)),
				power: bestCorrelation 
			}
		}
		lastCorrelation = correlation;
  }
	if (bestCorrelation > 0.01) {
		return {
			freq: sampleRate / bestLag,
			power: bestCorrelation 
		}
	}
	return null;
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
		color.r.toString(16)
	}${
		color.g.toString(16)
	}${
		color.b.toString(16)
	}`
}