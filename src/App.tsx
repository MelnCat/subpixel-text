import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
	const [text, setText] = useState("");
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	useEffect(() => {
		const ctx = canvasRef.current?.getContext("2d");
		if (ctx) ctxRef.current = ctx; 
	}, [])
	return (
		<main>
			<input value={text} onChange={e => setText(e.target.value)} />
			<canvas ref={canvasRef} />
		</main>
	);
}

export default App;
