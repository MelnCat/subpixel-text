import { Glyph } from "./glyph";
import { thinGlyphs } from "./thinGlyphs";

interface SubpixelFont {
	glyphs: Record<string, Glyph>;
	upper: boolean;
	height: number;
}

const thinFont: SubpixelFont = {
	upper: true,
	height: 5,
	glyphs: thinGlyphs
}

export const fonts = {
	thin: thinFont
}