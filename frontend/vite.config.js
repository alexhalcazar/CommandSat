import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig({
    plugins: [react()],
    define: {
        CESIUM_BASE_URL: JSON.stringify('/cesium/'),
    },
    resolve: {
        alias: {
            '@components': fileURLToPath(
                new URL('./src/components', import.meta.url)
            ),
        },
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },
});
