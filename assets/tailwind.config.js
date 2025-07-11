/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./theme/**/*.liquid"],
	theme: {
		fontFamily: {
			sans: [
				"jost",
				"lato",
				"-apple-system",
				"BlinkMacSystemFont",
				'"Segoe UI"',
				"Roboto",
				"Helvetica",
				"Arial",
				"sans-serif",
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"',
			],
		},
		colors: {
			...colors, // Include all default colors
			black: "#000000",
			white: "#ffffff",
			gray: {
				50: "#fdfdfd",
				100: "#f8f8f8",
				200: "#f0f0f0",
				300: "#e4e4e4",
				400: "#d5d5d5",
				500: "#c3c3c3",
				600: "#adadad",
				700: "#949494",
				800: "#505050",
				900: "#272727",
				950: "#1a1a1a",
			},
			pink: {
				50: "#fffbfd",
				100: "#ffeef8",
				200: "#ffd8ef",
				300: "#ffbae2",
				400: "#ff93d2",
				500: "#ff64be",
				600: "#ff2ca7",
				700: "#eb0089",
				800: "#85004d",
				900: "#47002a",
				950: "#33001e",
			},
		},
		extend: {
			maxWidth: {
				"screen-xl": "1600px",
			},
			width: {
				"max-content": "max-content",
			},
		},
	},
	daisyui: {
		prefix: "daisy",
		themes: [
			{
				mytheme: {
					...require("daisyui/src/theming/themes")["light"],
					primary: "#000000",
					secondary: "#ffffff",
					accent: "#ff3c9e",
					neutral: "#3d4451",
				},
			},
		],
	},
	plugins: [require("daisyui")],
};
