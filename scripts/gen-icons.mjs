/**
 * Generates PNG icons from public/favicon.svg using sharp.
 * Run once: node scripts/gen-icons.mjs
 */
import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))
const root  = resolve(__dir, '..')
const svg   = readFileSync(resolve(root, 'public/favicon.svg'))

const icons = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png',         size: 192 },
  { file: 'icon-512.png',         size: 512 },
]

for (const { file, size } of icons) {
  await sharp(svg)
    .resize(size, size)
    .png()
    .toFile(resolve(root, 'public', file))
  console.log(`✓ public/${file}  (${size}×${size})`)
}
