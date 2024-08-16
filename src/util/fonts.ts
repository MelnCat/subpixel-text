import { Glyph } from "./glyph";
import { mediumGlyphs } from "./mediumGlyphs";
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

const mediumFont: SubpixelFont = {
	upper: true,
	height: 5,
	glyphs: mediumGlyphs
}

export const fonts = {
	thin: thinFont,
	medium: mediumFont
}