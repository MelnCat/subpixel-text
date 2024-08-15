export const makeGlyph = (input: string) => {
	const split = input
		.replace(/\t/g, "")
		.split("\n")
		.filter(x => x);
	const data = split.flatMap(x =>
		x.split("\n").flatMap(y =>
			y
				.match(/.{1,3}/g)!
				.map(x => x.padEnd(3, " "))
				.flatMap(z =>
					z
						.split("")
						.map(c => (c === " " ? 0 : 1))
						.map((c, i) => [0xf8, 0xff, 0xf6][i] * c)
						.reduce((l, c) => (l << 8) + c, 0)
				)
		)
	);
	return { data, width: Math.ceil(split[0].length / 3) };
};
