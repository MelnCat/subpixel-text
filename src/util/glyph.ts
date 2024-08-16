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
	readonly height = this.glyphs[0]?.data.length ?? 0;
	constructor(public readonly glyphs: Glyph[], public readonly gap: number, public readonly offset: number) {
		if (!this.glyphs.every(x => x.data.length === this.glyphs[0]?.data.length)) throw new Error(`Heights incorrect`);
	}

	processRows(avoidBlue: boolean) {
		if (this.glyphs.length === 0) return [];
		const mergedRows = this.glyphs
			.map(x => x.data)
			.reduce((l, c) => l.map((x, i) => x.concat(Array(this.gap).fill(false)).concat(c[i])))
			.map(x => Array(this.offset).fill(false).concat(x));
		if (avoidBlue) {
			let lastBlue = 0;
			while (mergedRows.some(x => x.some((y, i) => i > lastBlue && i % 3 === 2 && y))) {
				const blueColumn = mergedRows.find(x => x.some((y, i) => i > lastBlue && i % 3 === 2 && y))!.findIndex((y, i) => i > lastBlue && i % 3 === 2 && y);
				for (const row of mergedRows) row.splice(blueColumn, 0, row[blueColumn]);
				lastBlue = blueColumn + 1;
			}
		}
		return mergedRows;
	}
	draw(invert: boolean, avoidBlue: boolean, setPixel: (x: number, y: number, color: number) => void) {
		if (this.glyphs.length === 0) return;
		const mergedRows = this.processRows(avoidBlue);
		
		const pixelRows = mergedRows.map(x => R.chunk(x, 3).map(([r, g, b]) => ((invert ? b : r) ? 0xf80000 : 0) + (g ? 0x00ff00 : 0) + ((invert ? r : b) ? 0xf6 : 0)));
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
