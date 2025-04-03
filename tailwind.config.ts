import type {Config} from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // light
                // colors
                lightBgColor: '#F1F7F7',
                lightCardBgColor: '#d6eae4',
                lightHoverColor: 'rgba(4,223,130,0.5)',
                lightActiveColor: '#04DF82',
                lightButtonColor: '#04614C',
                lightEmphasisColor: '#b7d8ca',
                // text
                lightTextColor: '#3a4343',
                // dark
                // colors
                darkBgColor: '#041010',
                darkCardBgColor: '#031b1b',
                darkHoverColor: 'rgba(4,223,130,0.5)',
                darkActiveColor: '#04DF82',
                darkButtonColor: '#04614C',
                darkEmphasisColor: '#142e28',
                darkHoverColor2: 'rgba(4,223,130,0.1)',
                // text
                darkTextColor: '#717D7D',


            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
