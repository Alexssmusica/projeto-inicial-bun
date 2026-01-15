await Bun.build({
	entrypoints: ['src/presentation/index.ts'],
	outdir: 'dist',
	target: 'bun',
	minify: {
		whitespace: true,
		syntax: true,
	},
	compile: {
		target: 'bun-windows-x64',
		outfile: 'server',
	},
});

export {};
