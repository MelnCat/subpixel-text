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
	width: 3, data
});

const thinFont: SubpixelFont = {
	upper: true,
	height: 5,
	glyphs: thinGlyphs
}

export const fonts = {
	thin: thinFont
}