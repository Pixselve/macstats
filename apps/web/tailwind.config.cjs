const config = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    daisyui: {
        themes: [
            {
                mcdonalds: {

                    "primary": "#ffd700",
                    "secondary": "#27742d",
                    "accent": "#db1020",
                    "neutral": "#27251F",
                    "base-100": "#FFFFFF",
                    "info": "#3ABFF8",
                    "success": "#36D399",
                    "warning": "#FBBD23",
                    "error": "#F87272",
                },
            },
        ],
    },
    theme: {
        extend: {}
    },

    plugins: [require("daisyui")]
};

module.exports = config;
