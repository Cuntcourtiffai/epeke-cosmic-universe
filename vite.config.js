import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';
// base './' keeps asset URLs valid under any GitHub Pages repo path
export default defineConfig({base:'./',plugins:[react()]});
