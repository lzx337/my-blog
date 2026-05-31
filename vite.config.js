import { defineConfig } from 'vite'
import { resolve, relative } from 'path'
import { readdirSync, statSync, copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from 'fs'
import * as esbuild from 'esbuild'

const projectRoot = process.cwd()

function findHtmlFiles(dir) {
  const entries = {}
  const collect = (currentDir) => {
    const items = readdirSync(currentDir)
    for (const item of items) {
      const fullPath = resolve(currentDir, item)
      if (statSync(fullPath).isDirectory()) {
        const base = resolve(projectRoot)
        if (fullPath === resolve(base, 'node_modules')) continue
        if (fullPath === resolve(base, 'dist')) continue
        if (fullPath === resolve(base, 'server')) continue
        if (fullPath === resolve(base, '.vscode')) continue
        if (fullPath === resolve(base, '.git')) continue
        if (fullPath === resolve(base, 'data')) continue
        if (fullPath === resolve(base, 'assets')) continue
        if (fullPath === resolve(base, 'css')) continue
        if (fullPath === resolve(base, 'js')) continue
        if (fullPath === resolve(base, '38个人简历')) continue
        if (fullPath === resolve(base, 'hrh')) continue
        collect(fullPath)
      } else if (item.endsWith('.html')) {
        const key = relative(projectRoot, fullPath)
          .replace(/\.html$/, '')
          .replace(/\\/g, '/')
        entries[key] = fullPath
      }
    }
  }
  collect(dir)
  return entries
}

function copyStaticPlugin() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const destDir = resolve(projectRoot, 'dist')

      const dirsToCopy = ['css', 'js', 'assets']
      dirsToCopy.forEach(dir => {
        const srcPath = resolve(projectRoot, dir)
        const destPath = resolve(destDir, dir)
        if (!existsSync(srcPath)) return
        copyDirRecursive(srcPath, destPath)
      })

      const rootFiles = [
        'service-worker.js', 'posts.json', 'sitemap.xml'
      ]
      rootFiles.forEach(file => {
        const srcPath = resolve(projectRoot, file)
        const destPath = resolve(destDir, file)
        if (!existsSync(srcPath)) return
        copyFileSync(srcPath, destPath)
        console.log(`  copy root: ${file}`)
      })

      const jsDir = resolve(destDir, 'js')
      if (existsSync(jsDir)) {
        minifyJsDir(jsDir)
      }

      console.log('[copy-static-assets] Static files copied & JS minified')
    }
  }
}

function copyDirRecursive(src, dest) {
  mkdirSync(dest, { recursive: true })
  const items = readdirSync(src)
  for (const item of items) {
    const srcPath = resolve(src, item)
    const destPath = resolve(dest, item)
    if (statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      copyFileSync(srcPath, destPath)
    }
  }
}

function minifyJsDir(dirPath) {
  const items = readdirSync(dirPath)
  for (const item of items) {
    const fullPath = resolve(dirPath, item)
    if (statSync(fullPath).isDirectory()) {
      minifyJsDir(fullPath)
    } else if (item.endsWith('.js')) {
      const code = readFileSync(fullPath, 'utf-8')
      const result = esbuild.transformSync(code, {
        minify: true,
        target: 'es2020',
        format: 'iife'
      })
      writeFileSync(fullPath, result.code, 'utf-8')
      const origSize = (code.length / 1024).toFixed(1)
      const newSize = (result.code.length / 1024).toFixed(1)
      console.log(`  minify: ${item} (${origSize}kB → ${newSize}kB)`)
    }
  }
}

export default defineConfig({
  base: './',
  appType: 'mpa',
  build: {
    outDir: 'dist',
    cssMinify: true,
    rollupOptions: {
      input: findHtmlFiles(projectRoot),
      output: {
        assetFileNames: (info) => {
          if (info.name.endsWith('.css')) {
            return 'css/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  plugins: [copyStaticPlugin()],
  server: {
    port: 3001,
    open: false,
    watch: {
      ignored: ['**/dist/**', '**/node_modules/**', '**/server/**']
    },
    proxy: {
      '/api/dashscope': {
        target: 'https://dashscope.aliyuncs.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dashscope/, '/api/v1/services/aigc/text-generation/generation')
      }
    }
  }
})