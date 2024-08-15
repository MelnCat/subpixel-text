import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { fonts } from "./util/fonts";

function App() {
	const [text, setText] = useState("");
	const [font, setFont] = useState("thin");
	const [padding, setPadding] = useState(1);
	const [gap, setGap] = useState(1);
	const fontData = useMemo(() => fonts[font as keyof typeof fonts], [font]);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	useEffect(() => {
		const ctx = canvasRef.current?.getContext("2d");
		if (ctx) ctxRef.current = ctx; 
	}, []);
	useEffect(() => {
		const lines = text.split(/\n/);
		const parsed = lines.map(line => line.split("").map(x => fontData.upper ? x.toUpperCase() : x).filter(x => x in fontData.glyphs));
		const width = Math.max(...parsed.map(x => x.reduce((l, c) => l + fontData.glyphs[c].width, 0) + gap * (x.length - 1) + 2 * padding));
		const height = lines.length * fontData.height + gap * (lines.length - 1) + 2 * padding;
		const ctx = ctxRef.current;
		if (!ctx) return;
		ctx.clearRect(0, 0, width, height);
		ctx.canvas.width  = width;
		ctx.canvas.height = height;
		const image = ctx.createImageData(width, height);
		for (let i = 0; i < height; i++)
			for (let j = 0; j < width; j++) {
				image.data[4 * (i * width + j) + 3] = 255;
			}
		for (const [i, line] of parsed.entries()) {
			let charLeft = gap;
			for (const [j, char] of line.entries()) {
				const glyph = fontData.glyphs[char];
				for (const [k, pixel] of glyph.data.entries()) {
					const top = padding + fontData.height * i + gap * i + Math.floor(k / glyph.width);
					const left = charLeft + k % glyph.width;
					image.data[4 * (top * width + left) + 0] = pixel >>> 16;
					image.data[4 * (top * width + left) + 1] = (pixel >>> 8) % 0x100;
					image.data[4 * (top * width + left) + 2] = pixel % 0x100;
					image.data[4 * (top * width + left) + 3] = 255;
				}
				charLeft += glyph.width + gap;
			}
		}
		ctx.putImageData(image, 0, 0);
	}, [text, fontData, gap, padding])
	return (
		<main>
			<textarea value={text} onChange={e => setText(e.target.value)} />
			<canvas ref={canvasRef} />
		</main>
	);
}

export default App;
