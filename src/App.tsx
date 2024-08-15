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
		const lines = text.split(/(\r\n|\r|\n)/);
		const parsed = lines.map(line => line.split("").map(x => fontData.upper ? x.toUpperCase() : x).filter(x => x in fontData.glyphs));
		const width = parsed.map(x => x.reduce((l, c) => l + fontData.glyphs[c].width, 0) + gap * (x.length - 1) + 2 * padding);
		const height = lines.length * fontData.height + gap * (lines.length - 1) + 2 * padding;
	}, [text])
	return (
		<main>
			<input value={text} onChange={e => setText(e.target.value)} />
			<canvas ref={canvasRef} />
		</main>
	);
}

export default App;
