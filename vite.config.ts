import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        // Recharts pulls React hooks; bundling React twice yields "Cannot read properties
        // of null (reading 'useContext')" from useResponsiveContainerContext.
        dedupe: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    optimizeDeps: {
        // Prefer resolving React from the app graph (see dedupe) instead of Recharts'
        // prebundle potentially carrying another copy.
        include: ['react', 'react-dom', 'recharts'],
    },
})
