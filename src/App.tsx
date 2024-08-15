import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { fonts } from "./util/fonts";
import { GlyphRow } from "./util/glyph";
import { setPixelColor } from "./util/color";

function App() {
	const [text, setText] = useState("");
	const [font, setFont] = useState("thin");
	const [padding, setPadding] = useState(1);
	const [gap, setGap] = useState(3);
	const fontData = useMemo(() => fonts[font as keyof typeof fonts], [font]);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	useEffect(() => {
		const ctx = canvasRef.current?.getContext("2d");
		if (ctx) ctxRef.current = ctx;
	}, []);
	useEffect(() => {
		const ctx = ctxRef.current;
		if (!ctx) return;
		if (!text.trim()) {
			ctx.canvas.width = 1;
			ctx.canvas.height = 1;
			return;
		}
		const lines = text.split(/\n/);
		const parsed = lines.map(line =>
			line
				.split("")
				.map(x => (fontData.upper ? x.toUpperCase() : x))
				.filter(x => x in fontData.glyphs)
		);
		const glyphRows = parsed.map(
			x =>
				new GlyphRow(
					x.map(y => fontData.glyphs[y]),
					gap
				)
		);
		const width = 2 * padding + Math.ceil(Math.max(...glyphRows.map(x => x.width)));
		const height = glyphRows.reduce((l, c) => l + c.height, 0) + Math.ceil(gap / 3) * (glyphRows.length - 1) + 2 * padding;
		ctx.fillRect(0, 0, width, height);
		ctx.canvas.width = width;
		ctx.canvas.height = height;
		const image = ctx.createImageData(width, height);
		for (let i = 0; i < height; i++)
			for (let j = 0; j < width; j++) {
				setPixelColor(image, j, i, 0x000000);
			}
		let top = padding;
		for (const [i, line] of glyphRows.entries()) {
			const left = padding;
			line.draw((x, y, c) => setPixelColor(image, x + left, y + top, c));
			top += line.height + Math.ceil(gap / 3);
		}
		ctx.putImageData(image, 0, 0);
	}, [text, fontData, gap, padding]);
	return (
		<main>
			<textarea value={text} onChange={e => setText(e.target.value)} />
			<canvas ref={canvasRef} />
		</main>
	);
}

export default App;
