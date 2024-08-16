import * as R from "remeda";

export class Glyph {
	readonly width = Math.max(...this.data.map(x => x.length));
	readonly height = this.data.length;
	constructor(public readonly data: boolean[][]) {}

	get isolated() {
		return new Glyph(this.data.map(x => x.concat(Array(Math.ceil(this.width / 3) * 3 - x.length).fill(false))));
	}
}
export class GlyphRow {
	public readonly width = this.glyphs.reduce((l, c) => l + c.width, 0) + this.gap * (this.glyphs.length - 1) + this.offset;
	readonly height = this.glyphs[0]?.data.length ?? 0;
	constructor(public readonly glyphs: Glyph[], public readonly gap: number, public readonly offset: number) {
		if (!this.glyphs.every(x => x.data.length === this.glyphs[0]?.data.length)) throw new Error(`Heights incorrect`);
	}

	draw(setPixel: (x: number, y: number, color: number) => void) {
		if (this.glyphs.length === 0) return;
		const mergedRows = this.glyphs
			.map(x => x.data)
			.reduce((l, c) => l.map((x, i) => x.concat(Array(this.gap).fill(false)).concat(c[i])))
			.map(x => Array(this.offset).fill(false).concat(x));
		const pixelRows = mergedRows.map(x => R.chunk(x, 3).map(([r, g, b]) => (r ? 0xf80000 : 0) + (g ? 0x00ff00 : 0) + (b ? 0xf6 : 0)));
		for (const [i, row] of pixelRows.entries()) {
			for (const [j, pixel] of row.entries()) {
				setPixel(j, i, pixel);
			}
		}
	}
}
export const makeGlyph = (input: string) => {
	const split = input
		.replace(/\t/g, "")
		.split("\n")
		.filter(x => x);
	return new Glyph(split.map(x => x.split("").map(y => y !== " ")));
};
