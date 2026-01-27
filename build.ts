await Bun.build({
	entrypoints: ['src/presentation/index.ts'],
	target: 'bun',
	minify: {
		whitespace: true,
		syntax: true,
	},
	compile: {
		target: 'bun-linux-x64',
		outfile: 'build/server',
	},
});

export {};
