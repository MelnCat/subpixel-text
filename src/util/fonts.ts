interface Glyph {
	width: number;
	height: number;
	data: number[];
}
interface SubpixelFont {
	gap: number;
	glyphs: Record<string, Glyph>;
	upper: boolean;
}

const thinGlyph = (data: number[]): Glyph => ({
	width: 1, height: 5, data
});

const thinFont: SubpixelFont = {
	gap: 1,
	upper: true,
	glyphs: {
		A: 
	}
}