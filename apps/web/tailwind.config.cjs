const config = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {
            colors: {
                "primary": "#ffd700",
                "secondary": "#27742d",
                "accent": "#db1020",
                "neutral": "#27251F",
                "base-100": "#FFFFFF",
                "info": "#3ABFF8",
                "success": "#36D399",
                "warning": "#FBBD23",
                "error": "#F87272",
            }
        }
    },

    plugins: []
};

module.exports = config;
