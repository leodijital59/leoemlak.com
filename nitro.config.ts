export default defineNitroConfig({
    hooks: {
        close: () => {
            if ((process.env.VERCEL || process.env.CI) && process.env.NODE_ENV === 'production') {
                process.exit(0)
            }
        }
    }
})
