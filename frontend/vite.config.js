import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
    plugins: [react(), svgr()],
    define: {
        CESIUM_BASE_URL: JSON.stringify('/cesium/'),
    },
    resolve: {
        alias: {
            '@components': fileURLToPath(
                new URL('./src/components', import.meta.url)
            ),
            '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
        },
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },
    test: {
        environment: 'happy-dom',
    },
});
