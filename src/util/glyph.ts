export class Glyph {
	readonly width = Math.max(...this.data.map(x => x.length));
	constructor(public readonly data: boolean[][]) {}

	readonly isolated = new Glyph(this.data.map(x => x.concat(Array(Math.ceil(this.width / 3) * 3 - x.length).fill(false))));
}
export class GlyphRow {
	constructor(public readonly glyphs: Glyph[]) {
		if (!this.glyphs.every(x => x.data.length === this.glyphs[0].data.length)) throw new Error(`Heights incorrect`);
	}

	draw(setPixel: (x: number, y: number, color: number) => void) {
		const mergedRows = this.glyphs.map(x => x.data).reduce((l, c) => l.map((x, i) => x.concat(c[i])));
		const padded = mergedRows.map(x => x.concat(Array(Math.ceil(mergedRows.length / 3) * 3 - x.length).fill(false)));
		const pixelRows = padded.map(x => x.reduce((l, c, i) => l[Math.floor(i / 3)] ? l[Math.floor(i / 3)].push(c) : l[Math.floor(i / 3)] = [c], [] as boolean[][]))
	}
}
export const makeGlyph = (input: string) => {
	const split = input
		.replace(/\t/g, "")
		.split("\n")
		.filter(x => x);
	const data = split.flatMap(x =>
		x.split("\n").flatMap(y =>
			y
				.match(/.{1,3}/g)!
				.map(x => x.padEnd(3, " "))
				.flatMap(z =>
					z
						.split("")
						.map(c => (c === " " ? 0 : 1))
						.map((c, i) => [0xf8, 0xff, 0xf6][i] * c)
						.reduce((l, c) => (l << 8) + c, 0)
				)
		)
	);
	return { data, width: Math.ceil(split[0].length / 3) };
};
