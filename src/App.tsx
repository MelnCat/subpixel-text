import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { fonts } from "./util/fonts";
import { GlyphRow } from "./util/glyph";
import { setPixelColor } from "./util/color";

function App() {
	const [text, setText] = useState("");
	const [font, setFont] = useState("thin");
	const [padding, setPadding] = useState(1);
	const [xGap, setXGap] = useState(3);
	const [yGap, setYGap] = useState(1);
	const [offset, setOffset] = useState(0);
	const [canvasSrc, setCanvasSrc] = useState("");
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
					xGap,
					offset
				)
		);
		const widthSubpixel = 2 * 3 * padding + Math.max(...glyphRows.map(x => x.width)) + offset; // Remove offset here for non-centered
		const width = Math.ceil(widthSubpixel / 3);
		const height = glyphRows.reduce((l, c) => l + c.height, 0) + yGap * (glyphRows.length - 1) + 2 * padding;
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
			top += line.height + yGap;
		}
		ctx.putImageData(image, 0, 0);
		setCanvasSrc(canvasRef.current?.toDataURL("image/png") ?? "");
	}, [text, fontData, xGap, yGap, padding, offset]);
	return (
		<main>
			<section className="input-panel">
				<textarea value={text} onChange={e => setText(e.target.value)} />
				<section className="settings">
					<div>
						Offset <input type="number" value={offset} onChange={e => setOffset(+e.target.value)} />
					</div>
					<div>
						X Gap <input type="number" value={xGap} onChange={e => setXGap(+e.target.value)} />
					</div>
					<div>
						Y Gap <input type="number" value={yGap} onChange={e => setYGap(+e.target.value)} />
					</div>
					<div>
						Padding <input type="number" value={padding} onChange={e => setPadding(+e.target.value)} />
					</div>
					<div>
						Font{" "}
						<select onChange={e => setFont(e.target.value)} value={font}>
							<option value="thin">Thin</option>
							<option value="medium">Medium</option>
						</select>
					</div>
				</section>
			</section>
			<section className="output">
				<canvas ref={canvasRef} />
				<section className="large-preview">
					<img alt="" src={canvasSrc} />
				</section>
			</section>
		</main>
	);
}

export default App;
