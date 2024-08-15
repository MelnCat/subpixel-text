import { thinGlyphs } from "./thinGlyphs";

interface Glyph {
	width: number;
	data: number[];
}
interface SubpixelFont {
	glyphs: Record<string, Glyph>;
	upper: boolean;
	height: number;
}

const thinGlyph = (data: number[]): Glyph => ({
	width: 1, data
});

const thinFont: SubpixelFont = {
	upper: true,
	height: 5,
	glyphs: Object.fromEntries(Object.entries(thinGlyphs).map(x => [x[0], thinGlyph(x[1])]))
}

export const fonts = {
	thin: thinFont
}