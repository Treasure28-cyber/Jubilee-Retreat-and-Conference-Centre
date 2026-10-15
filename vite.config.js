import {defineConfig} from 'vite';
import {cp} from 'node:fs/promises';
export default defineConfig({publicDir:false,esbuild:{jsx:'automatic'},server:{host:'127.0.0.1',port:3000},preview:{host:'127.0.0.1',port:3000},plugins:[{name:'jubilee-assets',async closeBundle(){await cp('assets','dist/assets',{recursive:true});}}]});
