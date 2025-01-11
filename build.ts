import { generateDtsBundle } from 'dts-bundle-generator'
import { existsSync } from 'fs'
import { mkdir, rm, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
import { build, type Options } from 'tsup'

if (existsSync('dist')) await rm('dist', { recursive: true })

const sharedOptions: Options = {
  platform: 'node',
  entry: ['src/index.ts'],
  bundle: true,
  minify: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  minifyWhitespace: true,
  skipNodeModulesBundle: true,
  clean: true,
  dts: false
}

await build({
  ...sharedOptions,
  format: 'cjs',
  splitting: false,
  shims: true,
  outDir: 'dist/cjs',
  tsconfig: './tsconfig.cjs.json'
})

await build({
  ...sharedOptions,
  format: 'esm',
  splitting: true,
  outDir: 'dist/mjs',
  tsconfig: './tsconfig.cjs.json'
})

await writeFile('dist/cjs/package.json', JSON.stringify({ type: 'commonjs' }, null, 2))
await writeFile('dist/mjs/package.json', JSON.stringify({ type: 'module' }, null, 2))

const dtsPath = join(process.cwd(), 'dist/types/index.ts')
const dtsCode = generateDtsBundle([
  {
    filePath: join(process.cwd(), 'src/index.ts'),
    output: {
      sortNodes: true,
      exportReferencedTypes: true,
      inlineDeclareExternals: true,
      inlineDeclareGlobals: true
    }
  }
])

await mkdir(dirname(dtsPath), { recursive: true })
await writeFile(dtsPath, dtsCode, { encoding: 'utf-8' })