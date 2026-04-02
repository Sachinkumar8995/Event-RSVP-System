/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9', // Sky blue-ish
                    600: '#0284c7',
                    700: '#0369a1',
                },
                dark: {
                    950: '#020617', // Deepest slate
                    900: '#0f172a', // Slate 900
                    800: '#1e293b',
                    card: '#1e293b',
                },
                secondary: {
                    500: '#8b5cf6', // Violet
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
